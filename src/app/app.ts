import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('ClinikTimeFrontend');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        const currentPath = this.router.url.split('?')[0];

        const publicRoutes = [
          '/login',
          '/register',
          '/reset-password'
        ];

        // 🔓 Route publique → AUCUNE vérification
        if (publicRoutes.includes(currentPath)) {
          return;
        }

        // 🔐 Route protégée → vérification session
        this.authService.loadCurrentUser().subscribe({
          error: () => {
            this.router.navigate(['/login']);
          }
        });

      });
  }
}
