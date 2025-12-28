import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface DisponibiliteDto {
  id: number;
  debut: string;
  fin: string;
  estBloque: boolean;
}

export interface CreerDisponibiliteDto {
  debut: string;
  fin: string;
}

@Injectable({ providedIn: 'root' })
export class DisponibiliteMedecinService {

  private readonly api = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer les disponibilités du médecin connecté
  getMesDisponibilites(): Observable<DisponibiliteDto[]> {
    return this.http.get<DisponibiliteDto[]>(
      `${this.api}/disponibilite/me`,
      { withCredentials: true }
    );
  }

  // ➕ Ouvrir une disponibilité
  ouvrirDisponibilite(dto: CreerDisponibiliteDto) {
    return this.http.post(
      `${this.api}/disponibilite/ouvrir`,
      dto,
      {
        withCredentials: true,
        responseType: 'text' // 🔥 IMPORTANT
      }
    );
  }

  // 🔒 Bloquer une disponibilité
  bloquerDisponibilite(dto: CreerDisponibiliteDto) {
    return this.http.post(
      `${this.api}/disponibilite/bloquer`,
      dto,
      {
        withCredentials: true,
        responseType: 'text' // 🔥 IMPORTANT
      }
    );
  }

  // 🗑️ Supprimer une disponibilité (si tu l’as côté backend)
  supprimerDisponibilite(id: number) {
    return this.http.delete(
      `${this.api}/disponibilite/${id}`,
      {
        withCredentials: true,
        responseType: 'text' // 🔥 OBLIGATOIRE
      }
    );
  }
}
