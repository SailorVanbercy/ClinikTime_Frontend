import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-medecin-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medecin-home.component.html',
  styleUrls: ['./medecin-home.component.css']
})
export class MedecinHomeComponent {

  constructor(public authService: AuthService) {}

}
