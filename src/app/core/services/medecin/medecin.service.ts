import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface MedecinDto {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  specialiteId: number;
}

@Injectable({ providedIn: 'root' })
export class MedecinService {

  private readonly api = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  rechercher(specialite?: string): Observable<MedecinDto[]> {
    let params = new HttpParams();

    if (specialite && specialite.trim().length > 0) {
      params = params.set('specialite', specialite.trim());
    }

    return this.http.get<MedecinDto[]>(
      `${this.api}/medecin`,
      {
        params,
        withCredentials: true
      }
    );
  }
}
