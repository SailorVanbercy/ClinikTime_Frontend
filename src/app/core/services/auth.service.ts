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

  me(): Observable<MeDto> {
    return this.http.get<MeDto>(
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
