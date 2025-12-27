import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';

// 1. IMPORTS DES NOUVEAUX COMPOSANTS
import { ProfileComponent } from './features/patient/pages/profile/profile.component';
import { CreateProfileComponent } from './features/patient/pages/create-profile/create-profile.component';
import {medecinGuard} from './core/guards/role.guard';

export const routes: Routes = [
  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // App
  { path: 'home', component: HomeComponent },

  // 2. NOUVELLES ROUTES PATIENT
  { path: 'profile', component: ProfileComponent },             // La liste (Cartes bleues)
  { path: 'create-profile', component: CreateProfileComponent }, // Le formulaire

  // 3. ROUTES MEDECIN
  { path: 'medecin', canActivate :[medecinGuard],
    loadComponent : () =>
      import('./features/medecin/medecin-home.component').then(m => m.MedecinHomeComponent)
  },
  {
    path: 'medecin/disponibilites',
    canActivate: [medecinGuard],
    loadComponent: () =>
      import('./features/medecin/disponibilites/medecin-disponibilites.component')
        .then(m => m.MedecinDisponibilitesComponent)
  },
  {
    path: 'medecin/rendezvous',
    canActivate: [medecinGuard],
    loadComponent: () =>
      import('./features/medecin/rendezvous/medecin-rendezvous.component')
        .then(m => m.MedecinRendezVousComponent)
  },

  // Redirections
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
