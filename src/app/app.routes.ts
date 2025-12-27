import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { ProfileComponent } from './features/patient/pages/profile/profile.component';
import { CreateProfileComponent } from './features/patient/pages/create-profile/create-profile.component';

// 1. NOUVEAUX IMPORTS POUR L'ADMIN
import { DashboardComponent } from './features/admin/pages/dashboard/dashboard.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // App
  { path: 'home', component: HomeComponent },

  // Patient
  { path: 'profile', component: ProfileComponent },
  { path: 'create-profile', component: CreateProfileComponent },

  // 2. NOUVELLE ROUTE ADMIN SÉCURISÉE
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [adminGuard] // Le vigile qui vérifie si tu es Admin
  },

  // Redirections (Toujours à la fin)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
