// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: number;
    username: string;
    email?: string;
    role?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://localhost:7188/api';
  private readonly TOKEN_KEY = 'token';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/Employees/Login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  logout(): void {
    this.removeToken();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }

  // Optional: Add token validation
  // validateToken(): Observable<boolean> {
  //   return this.http.get<boolean>(`${this.API_URL}/Auth/ValidateToken`);
  // }
}
