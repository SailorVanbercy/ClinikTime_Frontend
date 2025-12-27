import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface AdminUserResult {
  id: number;
  email: string;
  role: string;
  // nom et prenom sont optionnels, on ne les utilise plus dans le tableau
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5008/api/v1/user';

  constructor(private http: HttpClient) {}

  // 1. NOUVELLE MÉTHODE : Récupérer tout le monde
  getAllUsers(): Observable<AdminUserResult[]> {
    return this.http.get<AdminUserResult[]>(this.apiUrl, { withCredentials: true });
  }

  searchUser(email: string): Observable<AdminUserResult[]> {
    return this.http.get<AdminUserResult>(`${this.apiUrl}/by-email?email=${email}`, { withCredentials: true })
      .pipe(map(user => user ? [user] : []));
  }

  promoteToDoctor(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/promote-medecin`, {}, { withCredentials: true });
  }
}
