import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {environment} from '../../../../environments/environment.development';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [
    ReactiveFormsModule,CommonModule
  ],
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  api = environment.API_BASE_URL;
  form!: FormGroup;
  token!: string | null;
  loading = false;
  error: string | null = null;
  success = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.error = 'Lien invalide ou expiré';
      return;
    }

    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  requestReset() {
    this.http.post(`${this.api}/auth/password-reset/request`, {
      email: this.form.value.email
    }).subscribe(() => {
      alert('Si un compte existe, un email a été envoyé');
    });
  }


  submit(): void {
    if (this.form.invalid) return;

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.loading = true;
    this.error = null;

    this.http.post(`${this.api}/auth/password-reset/confirm`, {
      token: this.token,
      newPassword: this.form.value.password
    }).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: () => {
        this.loading = false;
        this.error = 'Lien expiré ou invalide';
      }
    });
  }
}
