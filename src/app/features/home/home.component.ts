import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MedecinService, MedecinDto } from '../../core/services/medecin/medecin.service';
import { RendezVousService } from '../../core/services/rendezvous/rendezvous.service';
import { PatientService } from '../../core/services/patient.service';
import { Patient } from '../../core/models/patient.model';
import { CreneauLibreDto } from '../../core/services/rendezvous/rendezvous.dto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  searchForm: FormGroup;

  // 🔥 États UI
  searched = false;
  loading = false;

  // 🔥 Données
  medecins: MedecinDto[] = [];

  // =========================
  // Prise de rendez-vous (panel)
  // =========================
  showRdvPanel = false;
  selectedMedecin: MedecinDto | null = null;

  // fiches patient de l'utilisateur
  fichesPatients: Patient[] = [];
  selectedFichePatientId: number | null = null;

  // sélection date / motif
  selectedDate: string | null = null;
  motif: string = '';

  // créneaux
  loadingCreneaux = false;
  creneauxLibres: CreneauLibreDto[] = [];
  selectedCreneau: CreneauLibreDto | null = null;

  // Données fictives conservées
  lastAppointments = [
    { doctor: 'Dr. Martin Dupont', specialty: 'Dentiste', date: '12 Nov', time: '14:00' },
    { doctor: 'Dr. Sophie Legrand', specialty: 'Généraliste', date: '10 Oct', time: '09:30' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService,
    private medecinService: MedecinService,
    private rendezvousService: RendezVousService,
    private patientService: PatientService,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.fb.group({
      term: ['']
    });
  }

  // =========================
  // Panel RDV
  // =========================
  openRdvPanel(medecin: MedecinDto): void {
    this.showRdvPanel = true;
    this.selectedMedecin = medecin;

    // reset
    this.selectedDate = null;
    this.motif = '';
    this.creneauxLibres = [];
    this.selectedCreneau = null;
    this.selectedFichePatientId = null;

    // charge les fiches patient
    this.patientService.getMyProfiles().subscribe({
      next: (patients) => {
        this.fichesPatients = patients ?? [];
        if (this.fichesPatients.length === 1 && this.fichesPatients[0].id != null) {
          this.selectedFichePatientId = this.fichesPatients[0].id;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERREUR getMyProfiles', err);
        this.fichesPatients = [];
        this.cdr.detectChanges();
      }
    });
  }

  closeRdvPanel(): void {
    this.showRdvPanel = false;
    this.selectedMedecin = null;
    this.selectedDate = null;
    this.motif = '';
    this.creneauxLibres = [];
    this.selectedCreneau = null;
    this.selectedFichePatientId = null;
  }

  // =========================
  // Créneaux
  // =========================
  loadCreneaux(): void {
    if (!this.selectedMedecin?.id || !this.selectedDate) {
      this.creneauxLibres = [];
      return;
    }

    this.loadingCreneaux = true;
    this.creneauxLibres = [];
    this.selectedCreneau = null;

    this.rendezvousService
      .getCreneauxLibres(this.selectedMedecin.id, this.selectedDate)
      .subscribe({
        next: (creneaux) => {
          this.creneauxLibres = creneaux ?? [];
          this.loadingCreneaux = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('ERREUR creneaux-libres', err);
          this.loadingCreneaux = false;
          this.creneauxLibres = [];
          this.cdr.detectChanges();
        }
      });
  }

  selectCreneau(creneau: CreneauLibreDto): void {
    this.selectedCreneau = creneau;
  }

  // =========================
  // Confirmation RDV
  // =========================
  confirmerRdv(): void {
    if (!this.selectedMedecin?.id) return;
    if (!this.selectedFichePatientId) return;
    if (!this.selectedCreneau) return;

    const motif = this.motif.trim() || 'Consultation';

    this.rendezvousService.create({
      medecinId: this.selectedMedecin.id,
      fichePatientId: this.selectedFichePatientId,
      debut: this.selectedCreneau.debut,
      motif
    }).subscribe({
      next: () => {
        alert('Rendez-vous créé ✅');
        this.closeRdvPanel();
      },
      error: (err) => {
        console.error('ERREUR creation rendezvous', err);
        alert('Impossible de créer le rendez-vous ❌');
      }
    });
  }

  // =========================
  // Recherche médecins
  // =========================
  onSearch(event?: Event): void {
    event?.preventDefault();

    const term = this.searchForm.value.term?.trim() ?? '';

    this.searched = true;
    this.loading = true;
    this.medecins = [];

    this.medecinService.rechercher(term).subscribe({
      next: (result) => {
        console.log('MEDECINS RECUS', result);
        this.medecins = result ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERREUR RECHERCHE', err);
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }

  // 🔥 Méthode SAFE pour l’avatar
  getInitial(value?: string): string {
    return value && value.length > 0
      ? value.charAt(0).toUpperCase()
      : '?';
  }
}
