import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup;
  error?: string;
  loading = false;

  showReset = false;
  resetEmail = '';
  resetMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
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

    this.auth.login(this.form.value).subscribe({
      next: () => {
        this.auth.me().subscribe({
          next: (user) => {
            localStorage.setItem('role', user.role);
            this.loading = false;
            this.router.navigate(['/home']);
          },
          error: () => {
            this.loading = false;
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

  toggleReset(): void {
    this.showReset = !this.showReset;
    this.resetMessage = null;
  }

  onForgotPassword(): void {
    if (!this.resetEmail || this.resetEmail.trim() === '') {
      this.resetMessage = 'Veuillez entrer votre email';
      return;
    }

    this.auth.requestPasswordReset(this.resetEmail)
      .subscribe(() => {
        this.resetMessage =
          'Si un compte existe, un email de réinitialisation a été envoyé';
      });
  }
}
