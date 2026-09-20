import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/auth/login-request.models';
import { RegisterRequest } from '../models/auth/register-request.models';
import { AuthResponse } from '../models/auth/auth-response.models';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = 'http://localhost:3000/api/users';
  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      data
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }

  // Lee los datos que trae el token (entre ellos la fecha de vencimiento "exp")
  private getTokenPayload(): { exp?: number } | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const base64 = token
        .split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  // Hay sesión solo si existe un token y todavía no venció
  isAuthenticated(): boolean {
    const payload = this.getTokenPayload();

    if (!payload || !payload.exp) {
      return false;
    }

    return payload.exp * 1000 > Date.now();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return this.isAuthenticated() && !!user && user.role_id === 1;
  }

  forgotPassword(email: string) {
    return this.http.post<any>(
      `${this.apiUrl}/forgot-password`,
      { email }
    );
  }

  resetPassword(
    token: string,
    password: string
  ) {
    return this.http.post<any>(
      `${this.apiUrl}/reset-password/${token}`,
      {
        password
      }
    );
  }

}
