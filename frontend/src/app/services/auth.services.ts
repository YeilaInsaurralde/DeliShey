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

  }

  isAuthenticated(): boolean {

    return !!this.getToken();

  }

  isLoggedIn(): boolean {

  return this.isAuthenticated();

}

getCurrentUser() {

  const user = localStorage.getItem('user');

  return user ? JSON.parse(user) : null;

}

}
