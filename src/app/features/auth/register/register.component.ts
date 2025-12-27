import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
// 1. IMPORT DU ROUTER
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['../login/login.component.scss']
})
export class RegisterComponent {

  form!: FormGroup;
  success = false;
  error?: string;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    // 2. INJECTION DU ROUTER
    private router: Router
  ) {
    // On garde uniquement Email et Mot de passe comme tu l'as demandé
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    this.error = undefined;

    // On force le rôle "Patient" ici pour que le backend sache qui s'inscrit
    const registerData = {
      ...this.form.value,
      role: 'Patient'
    };

    this.auth.register(registerData).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;

        // 3. LA REDIRECTION : C'est cette ligne qui manquait !
        // On redirige vers le login pour qu'il se connecte avec son nouveau compte
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err); // Utile pour voir l'erreur exacte dans la console (F12)
        this.error = 'Email déjà utilisé ou erreur serveur';
        this.loading = false;
      }
    });
  }
}
