import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // RouterModule est important ici !
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Ajoute RouterModule ici
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchForm: FormGroup;

  // Données fictives pour l'instant (US-R1)
  lastAppointments = [
    { doctor: 'Dr. Martin Dupont', specialty: 'Dentiste', date: '12 Nov', time: '14:00', image: 'assets/doc1.jpg' },
    { doctor: 'Dr. Sophie Legrand', specialty: 'Généraliste', date: '10 Oct', time: '09:30', image: 'assets/doc2.jpg' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.searchForm = this.fb.group({
      term: [''],
      location: ['Bruxelles']
    });
  }

  onSearch() {
    console.log('Recherche :', this.searchForm.value);
    // Plus tard : redirection vers page de résultats
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
