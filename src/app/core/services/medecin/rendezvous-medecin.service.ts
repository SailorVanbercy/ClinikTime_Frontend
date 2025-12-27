import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface RendezVousDto {
  id: number;
  debut: string;
  fin: string;
  statut: string;
  motif: string;
  fichePatientId: number;
  patientNom: string;
  patientPrenom: string;
}

@Injectable({ providedIn: 'root' })
export class RendezVousMedecinService {

  private readonly api = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  getMesRendezVous(): Observable<RendezVousDto[]> {
    return this.http.get<RendezVousDto[]>(
      `${this.api}/rendezvous/GetMedecinRdv`,
      { withCredentials: true }
    );
  }

  refuserRendezVous(id: number) {
    return this.http.put(
      `${this.api}/rendezvous/${id}/refuser`,
      {},
      {
        withCredentials: true,
        responseType: 'text'
      }
    ).pipe(
      map(() => null)
    );
  }


  reprogrammerRendezVous(id: number, nouvelleDate: string) : Observable<string> {
    return this.http.put(
      `${this.api}/rendezvous/${id}/reprogrammer`,
      { nouveauDebut : nouvelleDate },
      {
        withCredentials: true,
        responseType: 'text'
      }
    );
  }
}
