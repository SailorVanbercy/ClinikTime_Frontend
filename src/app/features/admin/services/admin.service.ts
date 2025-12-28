import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface AdminUserResult {
  id: number;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5008/api/v1/user';

  constructor(private http: HttpClient) {}

  // 1. Récupérer tout le monde
  getAllUsers(): Observable<AdminUserResult[]> {
    return this.http.get<AdminUserResult[]>(this.apiUrl, { withCredentials: true });
  }

  // 2. Recherche par email
  searchUser(email: string): Observable<AdminUserResult[]> {
    return this.http.get<AdminUserResult>(`${this.apiUrl}/by-email?email=${email}`, { withCredentials: true })
      .pipe(map(user => user ? [user] : []));
  }

  // 3. Promotion avec envoi des données (C'EST ICI LA CORRECTION 👇)
  promoteToDoctor(id: number, data: any): Observable<any> {
    // On remplace le {} vide par 'data' qui contient {nom, prenom, telephone, specialiteId}
    return this.http.post(
      `${this.apiUrl}/${id}/promote-medecin`,
      data,
      { withCredentials: true }
    );
  }
}
