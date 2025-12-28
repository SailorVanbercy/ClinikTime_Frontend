import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface LoginDto {
  email: string;
  motDePasse: string;
}

export interface RegisterDto {
  email: string;
  motDePasse: string;
}

export interface CurrentUser {
  id: number;
  email: string;
  role: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly api = environment.API_BASE_URL;
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  constructor(private http: HttpClient) {}


  loadCurrentUser(): Observable<CurrentUser>{
    return this.http.get<CurrentUser>(`${this.api}/auth/me`,
      {withCredentials: true}).pipe(
        tap(user => this.currentUserSubject.next(user))
    );
  }

  getCurrentUser():CurrentUser | null{
    return this.currentUserSubject.value;
  }
  private roleSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('role')
  );

  role$ = this.roleSubject.asObservable();

  setRole(role: string) {
    localStorage.setItem('role', role);
    this.roleSubject.next(role);
  }

  clearRole() {
    localStorage.removeItem('role');
    this.roleSubject.next(null);
  }

  login(dto: LoginDto): Observable<{ role: string }> {
    return this.http.post<{ role: string }>(
      `${this.api}/auth/login`,
      dto,
      { withCredentials: true },
    ).pipe(tap(response => {
      this.setRole(response.role);
    }));
  }

  register(dto: RegisterDto): Observable<void> {
    return this.http.post<void>(
      `${this.api}/user`,
      dto,
      { withCredentials: true }
    );
  }

  me(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(
      `${this.api}/auth/me`,
      { withCredentials: true }
    );
  }

  logout(): Observable<void> {
    this.clearRole();
    return this.http.post<void>(
      `${this.api}/auth/logout`,
      {},
      {
        withCredentials: true,
        responseType: 'text' as 'json'
      }
    );
  }
  // 🔁 DEMANDE RESET (depuis login)
  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(
      `${this.api}/auth/password-reset/request`,
      { email }
    );
  }
  // 🔐 CONFIRMATION RESET (depuis reset-password)
  confirmPasswordReset(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(
      `${this.api}/auth/password-reset/confirm`,
      {
        token,
        newPassword
      }
    );
  }
}
