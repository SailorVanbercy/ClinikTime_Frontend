import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  // CORRECTION 1 : Ajout du tiret "-" pour correspondre à [Route("api/v1/fiche-patient")]
  private apiUrl = 'http://localhost:5008/api/v1/fiche-patient';

  constructor(private http: HttpClient) {}

  // CREATE
  createProfile(patient: Patient): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, patient, { withCredentials: true });
  }

  // GET ALL MY FICHES
  getMyProfiles(): Observable<Patient[]> {
    // CORRECTION 2 : Changement de "/my-profiles" vers "/me" pour correspondre à [HttpGet("me")]
    return this.http.get<Patient[]>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  // (Optionnel) GET BY ID si tu en as besoin plus tard
  getProfileById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
