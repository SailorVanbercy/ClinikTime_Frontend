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
export class DashboardComponent implements OnInit { // Ajout de OnInit
  searchTerm: string = '';

  // TOUTES les données (source complète)
  allUsers: AdminUserResult[] = [];

  // Données affichées (page actuelle)
  paginatedUsers: AdminUserResult[] = [];

  message: string = '';
  error: string = '';

  // Variables de pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(
    private adminService: AdminService,
    private cd: ChangeDetectorRef
  ) {}

  // 1. Au chargement de la page
  ngOnInit() {
    this.loadAllUsers();
  }

  loadAllUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.applySortAndPagination(); // On trie et on pagine
      },
      error: (err) => console.error(err)
    });
  }

  search() {
    if (!this.searchTerm) {
      this.loadAllUsers(); // Si recherche vide, on recharge tout
      return;
    }

    this.message = '';
    this.error = '';

    this.adminService.searchUser(this.searchTerm).subscribe({
      next: (data) => {
        this.allUsers = data; // Le résultat devient la source
        this.currentPage = 1; // On revient page 1
        this.applySortAndPagination();
      },
      error: (err) => {
        this.error = "Aucun utilisateur trouvé";
        this.allUsers = [];
        this.applySortAndPagination();
      }
    });
  }

  promote(user: AdminUserResult) {
    if (!confirm(`Passer ${user.email} en Médecin ?`)) return;

    this.adminService.promoteToDoctor(user.id).subscribe({
      next: () => {
        user.role = 'Medecin';
        this.message = `Succès : ${user.email} est maintenant médecin.`;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = "Erreur lors de la promotion.";
        this.cd.detectChanges();
      }
    });
  }

  // --- LOGIQUE INTERNE ---

  private applySortAndPagination() {
    // 1. Tri Alphabétique par Email
    this.allUsers.sort((a, b) => a.email.localeCompare(b.email));

    // 2. Calcul du nombre de pages
    this.totalPages = Math.ceil(this.allUsers.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;

    // 3. Découpage pour la page actuelle
    this.updatePaginatedList();
  }

  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // On coupe le tableau pour ne garder que les 10 éléments de la page
    this.paginatedUsers = this.allUsers.slice(startIndex, endIndex);

    this.cd.detectChanges();
  }

  // --- BOUTONS PAGINATION ---

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
    }
  }
}
