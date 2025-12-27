import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CreneauLibreDto, CreateRendezVousDto } from './rendezvous.dto';

@Injectable({ providedIn: 'root' })
export class RendezVousService {

  private readonly api = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  /**
   * POST /api/v1/rendezvous
   */
  create(dto: CreateRendezVousDto): Observable<void> {
    return this.http.post<void>(
      `${this.api}/rendezvous`,
      dto,
      { withCredentials: true }
    );
  }

  /**
   * GET /api/v1/rendezvous/{medecinId}/creneaux-libres?date=YYYY-MM-DD
   */
  getCreneauxLibres(medecinId: number, date: string): Observable<CreneauLibreDto[]> {
    return this.http.get<CreneauLibreDto[]>(
      `${this.api}/rendezvous/${medecinId}/creneaux-libres`,
      {
        params: { date },
        withCredentials: true
      }
    );
  }
}
