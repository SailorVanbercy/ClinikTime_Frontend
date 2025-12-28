import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../../core/components/navbar/navbar.component';
import { AdminService, AdminUserResult } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // --- DONNÉES UTILISATEURS ---
  searchTerm: string = '';
  allUsers: AdminUserResult[] = [];       // Source de vérité
  paginatedUsers: AdminUserResult[] = []; // Ce qu'on affiche

  // --- PAGINATION ---
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // --- FEEDBACK ---
  message: string = '';
  error: string = '';

  // --- MODALE & FORMULAIRE ---
  showModal: boolean = false;
  selectedUser: AdminUserResult | null = null;

  medecinForm = {
    nom: '',
    prenom: '',
    telephone: '',
    specialiteId: 1
  };

  // --- LISTE DES SPÉCIALITÉS ---
  specialites = [
    { id: 1, nom: 'Médecine générale' },
    { id: 2, nom: 'Médecine familiale' },
    { id: 3, nom: 'Pédiatrie' },
    { id: 4, nom: 'Gynécologie' },
    { id: 5, nom: 'Cardiologie' },
    { id: 6, nom: 'Dermatologie' },
    { id: 7, nom: 'Ophtalmologie' },
    { id: 8, nom: 'ORL' },
    { id: 9, nom: 'Neurologie' },
    { id: 10, nom: 'Psychiatrie' },
    { id: 11, nom: 'Psychologie' },
    { id: 12, nom: 'Chirurgie générale' },
    { id: 13, nom: 'Chirurgie orthopédique' },
    { id: 14, nom: 'Chirurgie plastique' },
    { id: 15, nom: 'Neurochirurgie' },
    { id: 16, nom: 'Chirurgie vasculaire' },
    { id: 17, nom: 'Endocrinologie' },
    { id: 18, nom: 'Gastro-entérologie' },
    { id: 19, nom: 'Néphrologie' },
    { id: 20, nom: 'Pneumologie' },
    { id: 21, nom: 'Rhumatologie' },
    { id: 22, nom: 'Hématologie' },
    { id: 23, nom: 'Oncologie' },
    { id: 24, nom: 'Gériatrie' },
    { id: 25, nom: 'Kinésithérapie' },
    { id: 26, nom: 'Ostéopathie' },
    { id: 27, nom: 'Podologie' },
    { id: 28, nom: 'Diététique' },
    { id: 29, nom: 'Logopédie' },
    { id: 30, nom: 'Médecine d’urgence' },
    { id: 31, nom: 'Médecine du sport' },
    { id: 32, nom: 'Médecine du travail' },
    { id: 33, nom: 'Médecine préventive' },
    { id: 34, nom: 'Sexologie' },
    { id: 35, nom: 'Addictologie' },
    { id: 36, nom: 'Psychiatrie infantile' },
    { id: 37, nom: 'Radiologie' },
    { id: 38, nom: 'Anesthésiologie' },
    { id: 39, nom: 'Médecine nucléaire' }
  ];

  constructor(
    private adminService: AdminService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAllUsers();
  }

  // --- CHARGEMENT & RECHERCHE ---

  loadAllUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.applySortAndPagination();
      },
      error: (err) => console.error(err)
    });
  }

  search() {
    if (!this.searchTerm) {
      this.loadAllUsers();
      return;
    }
    this.message = '';
    this.error = '';

    this.adminService.searchUser(this.searchTerm).subscribe({
      next: (data) => {
        this.allUsers = data;
        this.currentPage = 1; // Reset page 1 pour recherche
        this.applySortAndPagination();
      },
      error: () => {
        this.allUsers = [];
        this.error = "Aucun utilisateur trouvé.";
        this.applySortAndPagination();
      }
    });
  }

  // --- LOGIQUE PAGINATION & TRI ---

  private applySortAndPagination() {
    // 1. Tri Alphabétique (Email)
    this.allUsers.sort((a, b) => a.email.localeCompare(b.email));

    // 2. Calcul pages
    this.totalPages = Math.ceil(this.allUsers.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;

    // 3. Découpage
    this.updatePaginatedList();
  }

  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.allUsers.slice(startIndex, endIndex);
    this.cd.detectChanges();
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.updatePaginatedList();
    }
  }

  // --- LOGIQUE MODALE ---

  openPromoteModal(user: AdminUserResult) {
    this.selectedUser = user;
    this.showModal = true;
    // Reset du formulaire
    this.medecinForm = {
      nom: '',
      prenom: '',
      telephone: '',
      specialiteId: 1
    };
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
  }

  confirmPromote() {
    if (!this.selectedUser) return;

    // Validation simple
    if(!this.medecinForm.nom || !this.medecinForm.prenom || !this.medecinForm.telephone) {
      alert("Merci de remplir tous les champs du médecin.");
      return;
    }

    // Appel au service avec l'ID et le DTO du formulaire
    this.adminService.promoteToDoctor(this.selectedUser.id, this.medecinForm).subscribe({
      next: () => {
        // Mise à jour locale pour éviter de recharger la page
        if (this.selectedUser) {
          this.selectedUser.role = 'Medecin';
        }

        this.message = `Succès : ${this.selectedUser?.email} est maintenant Médecin.`;
        this.error = '';
        this.closeModal();
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || "Une erreur est survenue lors de la promotion.";
        this.message = '';
        this.closeModal(); // On ferme quand même la modale pour voir l'erreur rouge
        this.cd.detectChanges();
      }
    });
  }
}
