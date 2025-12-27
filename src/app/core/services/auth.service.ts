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
  isMedecin() : boolean{
    return this.currentUserSubject.value?.role ==="Medecin";
  }

  login(dto: LoginDto): Observable<void> {
    return this.http.post<void>(
      `${this.api}/auth/login`,
      dto,
      { withCredentials: true }
    );
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
    return this.http.post<void>(
      `${this.api}/auth/logout`,
      {},
      {
        withCredentials: true,
        responseType: 'text' as 'json'
      }
    );
  }
}
