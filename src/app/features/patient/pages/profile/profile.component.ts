import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // 1. Ajout de RouterModule
import { PatientService } from '../../../../core/services/patient.service';
import { Patient } from '../../../../core/models/patient.model';
import { AuthService } from '../../../../core/services/auth.service'; // 2. Ajout de AuthService

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule], // 3. Ajout dans les imports du composant
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profiles: Patient[] = [];
  loading = true;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private authService: AuthService // 4. Injection du service d'medecin
  ) {}

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    console.log('--- Début du chargement des profils ---');

    this.patientService.getMyProfiles().subscribe({
      next: (data) => {
        console.log('Données reçues :', data);

        this.profiles = data || [];
        this.loading = false;

        // Force la mise à jour de l'écran (Change Detection)
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('ERREUR :', err);
        this.loading = false;

        // On force aussi en cas d'erreur
        this.cd.detectChanges();
      }
    });
  }

  addProfile() {
    this.router.navigate(['/create-profile']);
  }

  // 5. Méthode pour se déconnecter
  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
