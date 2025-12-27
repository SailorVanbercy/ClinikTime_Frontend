import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface LoginDto {
  email: string;
  motDePasse: string;
}

export interface RegisterDto {
  email: string;
  motDePasse: string;
}

export interface MeDto {
  id: number;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly api = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  checkAuth(): Observable<any> {
    return this.http.get(`${this.api}/auth/me`, {
      withCredentials: true
    });
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

  // --- 👇 CORRECTION MAJEURE ICI 👇 ---
  // On appelle '/user/me' (UserController) car c'est lui qui renvoie le JSON { role: "Admin", ... }
  // L'ancien '/auth/me' renvoyait vide, ce qui faisait planter le login.
  me(): Observable<MeDto> {
    return this.http.get<MeDto>(
      `${this.api}/user/me`,
      { withCredentials: true }
    );
  }
  // ------------------------------------

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
