import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form!: FormGroup;
  error?: string;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    this.error = undefined;

    // 1. Login (Cookie)
    this.auth.login(this.form.value).subscribe({
      next: () => {
        console.log('LOGIN OK - Récupération du profil...');

        // 2. Récupération du profil (Qui suis-je ?)
        this.auth.me().subscribe({
          next: (user) => {
            console.log('Profil récupéré :', user);

            // On sauvegarde le rôle pour le Guard et la Navbar
            localStorage.setItem('role', user.role);

            this.loading = false;

            // --- CORRECTION ICI ---
            // On redirige tout le monde vers l'accueil, même les admins.
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error('Erreur récupération profil', err);
            this.loading = false;
            // En cas d'erreur technique, on envoie quand même à l'accueil
            this.router.navigate(['/home']);
          }
        });
      },
      error: () => {
        this.error = 'Email ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }
}
