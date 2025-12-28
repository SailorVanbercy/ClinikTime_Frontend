import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MedecinService, MedecinDto } from '../../core/services/medecin/medecin.service';
import { RendezVousService } from '../../core/services/rendezvous/rendezvous.service';
import { PatientService } from '../../core/services/patient.service';
import { Patient } from '../../core/models/patient.model';
import {CreneauLibreDto, RendezVousDto} from '../../core/services/rendezvous/rendezvous.dto';
import {NavbarComponent} from '../../core/components/navbar/navbar.component';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {DashboardComponent} from '../admin/pages/dashboard/dashboard.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

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

  //RDV
  private refresh$ = new BehaviorSubject<void>(undefined);
  myRendezVous$: Observable<RendezVousDto[]> = this.refresh$.pipe(switchMap(() =>this.rendezvousService.getMyRendezVous()));

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService,
    private medecinService: MedecinService,
    private rendezvousService: RendezVousService,
    private patientService: PatientService,
    private cdr: ChangeDetectorRef,
  ) {
    this.searchForm = this.fb.group({
      term: ['']
    });
  }

  ngOnInit(): void {
        if(this.authService.me()){
          this.refresh$.next();
        }
    }

  // --- LISTE DES SPÉCIALITÉS ---
  specialites = [
    { id: 1, nom: 'Médecine générale' },
    { id: 2, nom: 'Médecine familiale' },
    { id: 3, nom: 'Pédiatrie' },
    { id: 4, nom: 'Gynécologie' },
    { id: 5, nom: 'Cardiologie' },
    { id: 6, nom: 'Dermatologie' },
    { id: 7, nom: 'Ophtalmologie' },
    { id: 8, nom: 'ORL' },
    { id: 9, nom: 'Neurologie' },
    { id: 10, nom: 'Psychiatrie' },
    { id: 11, nom: 'Psychologie' },
    { id: 12, nom: 'Chirurgie générale' },
    { id: 13, nom: 'Chirurgie orthopédique' },
    { id: 14, nom: 'Chirurgie plastique' },
    { id: 15, nom: 'Neurochirurgie' },
    { id: 16, nom: 'Chirurgie vasculaire' },
    { id: 17, nom: 'Endocrinologie' },
    { id: 18, nom: 'Gastro-entérologie' },
    { id: 19, nom: 'Néphrologie' },
    { id: 20, nom: 'Pneumologie' },
    { id: 21, nom: 'Rhumatologie' },
    { id: 22, nom: 'Hématologie' },
    { id: 23, nom: 'Oncologie' },
    { id: 24, nom: 'Gériatrie' },
    { id: 25, nom: 'Kinésithérapie' },
    { id: 26, nom: 'Ostéopathie' },
    { id: 27, nom: 'Podologie' },
    { id: 28, nom: 'Diététique' },
    { id: 29, nom: 'Logopédie' },
    { id: 30, nom: 'Médecine d’urgence' },
    { id: 31, nom: 'Médecine du sport' },
    { id: 32, nom: 'Médecine du travail' },
    { id: 33, nom: 'Médecine préventive' },
    { id: 34, nom: 'Sexologie' },
    { id: 35, nom: 'Addictologie' },
    { id: 36, nom: 'Psychiatrie infantile' },
    { id: 37, nom: 'Radiologie' },
    { id: 38, nom: 'Anesthésiologie' },
    { id: 39, nom: 'Médecine nucléaire' }
  ];


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
        this.refresh$.next();
      },
      error: (err) => {
        console.error('ERREUR creation rendezvous', err);
        alert('Impossible de créer le rendez-vous ❌');
      }
    });
  }

  //DELETE RDV
  deleteRdv(id : number) : void {
    if(!confirm("Vous voulez vraiment annuler ce rendez vous ?")){
      return;
    }

    this.rendezvousService.annulerRdv(id).subscribe({
      next: () => {
        alert('Rendez vous annulé ✅');
        this.refresh$.next();
      },
      error: (err) => {
        console.error('Erreur annulation rdv', err);
        alert("Impossible d\'annuler le rendez-vous");
      }
    })
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
  getSpecialiteName(specialiteId: number | null | undefined): string{
    if(!specialiteId) return 'Spécialité inconnue';
    const spec = this.specialites.find(s => s.id === specialiteId);
    return spec ? spec.nom : 'Specialité inconnue'
  }
}
