import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {NavbarComponent} from '../../core/components/navbar/navbar.component';

@Component({
  selector: 'app-medecin-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './medecin-home.component.html',
  styleUrls: ['./medecin-home.component.css']
})
export class MedecinHomeComponent {

  constructor(public authService: AuthService) {}

}
