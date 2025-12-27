// src/app/features/patient/pages/create-profile/create-profile.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../../../core/services/patient.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent {
  profileForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router
  ) {
    // STRICTEMENT LES COLONNES DE TA BDD
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      sexe: ['M', Validators.required],           // Valeur par défaut : Homme
      lienParente: ['Moi', Validators.required]   // Valeur par défaut : Moi
    });
  }

  submit() {
    if (this.profileForm.invalid) return;

    this.loading = true;

    // Le backend se chargera de remplir 'UtilisateurId' via le token de connexion
    this.patientService.createProfile(this.profileForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/profile']); // Retour à la liste après création
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors de la création de la fiche.";
        this.loading = false;
      }
    });
  }
}
