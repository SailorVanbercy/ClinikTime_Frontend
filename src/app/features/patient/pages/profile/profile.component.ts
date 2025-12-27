import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PatientService } from '../../../../core/services/patient.service';
import { Patient } from '../../../../core/models/patient.model';
import { NavbarComponent } from '../../../../core/components/navbar/navbar.component'; // 1. IMPORT DU COMPOSANT PARTAGÉ

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent // 2. AJOUT DANS LES IMPORTS
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profiles: Patient[] = [];
  loading = true;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private cd: ChangeDetectorRef
    // Plus besoin de AuthService ici !
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
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('ERREUR :', err);
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  addProfile() {
    this.router.navigate(['/create-profile']);
  }

  // La méthode logout() a été supprimée car <app-navbar> s'en occupe
}
