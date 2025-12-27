import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], // RouterModule permet d'utiliser routerLink
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  authService = inject(AuthService);
  router = inject(Router);

  // On vérifie le rôle pour afficher le bouton "Admin" ou non
  isAdmin = localStorage.getItem('role') === 'Admin';

  logout() {
    this.authService.logout().subscribe({
      next: () => this.finalizeLogout(),
      error: () => this.finalizeLogout()
    });
  }

  private finalizeLogout() {
    // Nettoyage complet
    localStorage.removeItem('role');
    localStorage.removeItem('token'); // Si tu stockes le token aussi
    this.router.navigate(['/login']);
  }
}
