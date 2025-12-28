import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// On retire AuthService et Router car on ne doit pas rediriger ici

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // RouterOutlet est essentiel pour afficher les pages
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // C'est tout ! Le composant racine ne doit servir que de coquille vide.
  protected readonly title = signal('ClinikTimeFrontend');
}
