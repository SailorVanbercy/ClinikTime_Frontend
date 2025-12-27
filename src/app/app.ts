import {Component, OnInit, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from './core/services/auth.service';

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
    private authService : AuthService,
    private router : Router
  ) {}

  ngOnInit() {
    this.authService.checkAuth().subscribe({
      next: () => {
        //utilisateur déjà connecté
        this.router.navigate(['/home']);
      },
      error : () => {
        //utilisateur non connecté
        this.router.navigate(['/login']);
      }
    });
  }
}
