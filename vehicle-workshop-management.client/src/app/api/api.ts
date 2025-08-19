import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:7188/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/Employees/Login`, { username, password });
  }
  get(endpoint: string): Observable<any> {
    return this.http.get(`${API_URL}/${endpoint}`);
  }

  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${API_URL}/${endpoint}`, data);
  }

  put(endpoint: string, id: number, data: any): Observable<any> {
    return this.http.put(`${API_URL}/${endpoint}/${id}`, data);
  }

  delete(endpoint: string, id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${endpoint}/${id}`);
  }
  patch(endpoint: string, id: number, data: any): Observable<any> {
    return this.http.patch(`${API_URL}/${endpoint}/${id}`, data);
  }

  register(employee: any): Observable<any> {
    return this.http.post(`${API_URL}/Employees/Register`, employee);
  }
  
}
