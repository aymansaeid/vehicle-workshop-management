import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  employeeId: string;
  name: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly BASE_URL = `${environment.apiUrl}/api/Employees`;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest) {
    return this.http.post<LoginResponse>(
      `${this.BASE_URL}/Login`,
      credentials
    );
  }

  logout() {
    // Add if your backend has logout endpoint
    return this.http.post(`${this.BASE_URL}/Logout`, {});
  }
}
