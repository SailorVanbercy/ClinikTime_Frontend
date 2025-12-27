import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../core/components/navbar/navbar.component'; // 1. IMPORT DU COMPOSANT PARTAGÉ

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent // 2. AJOUT DANS LES IMPORTS
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchForm: FormGroup;

  // Données fictives
  lastAppointments = [
    { doctor: 'Dr. Martin Dupont', specialty: 'Dentiste', date: '12 Nov', time: '14:00', image: 'assets/doc1.jpg' },
    { doctor: 'Dr. Sophie Legrand', specialty: 'Généraliste', date: '10 Oct', time: '09:30', image: 'assets/doc2.jpg' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
    // On a retiré AuthService ici, plus besoin !
  ) {
    this.searchForm = this.fb.group({
      term: [''],
      location: ['Bruxelles']
    });
  }

  onSearch() {
    console.log('Recherche :', this.searchForm.value);
  }

  // La méthode logout() a été supprimée
}
