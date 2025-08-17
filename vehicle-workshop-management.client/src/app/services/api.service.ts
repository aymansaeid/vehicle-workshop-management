// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: any; // Add user properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'https://localhost:7188/api';

  constructor(private http: HttpClient) { }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/Employees/Login`, credentials);
  }

  // Add other API methods here as needed
  // getCustomers(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.API_URL}/Customers`);
  // }
}
