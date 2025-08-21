import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:7188/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  // Authentication
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/Employees/Login`, { username, password });
  }

  register(employee: any): Observable<any> {
    return this.http.post(`${API_URL}/Employees/Register`, employee);
  }

  // Generic CRUD operations
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

  // Task-specific methods
  getTasks(): Observable<any> {
    return this.http.get(`${API_URL}/Tasks`);
  }

  getTask(taskId: number): Observable<any> {
    return this.http.get(`${API_URL}/Tasks/${taskId}`);
  }

  createTask(task: any): Observable<any> {
    return this.http.post(`${API_URL}/Tasks`, task);
  }

  updateTask(taskId: number, task: any): Observable<any> {
    return this.http.put(`${API_URL}/Tasks/${taskId}`, task);
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${API_URL}/Tasks/${taskId}`);
  }

  assignTaskToProject(taskId: number, projectId: number): Observable<any> {
    return this.http.put(`${API_URL}/Tasks/${taskId}/assign-to-project`, { projectId });
  }

  assignTaskToEmployee(taskId: number, employeeId: number): Observable<any> {
    return this.http.post(`${API_URL}/Tasks/AssignTaskToEmployee`, { taskId, employeeId });
  }

  updateTaskStatus(taskId: number, status: string): Observable<any> {
    return this.http.patch(`${API_URL}/Tasks/${taskId}/status`, { status });
  }

  getTasksByProject(projectId: number): Observable<any> {
    return this.http.get(`${API_URL}/Tasks/byProject/${projectId}`);
  }

  getTasksByStatus(status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.get(`${API_URL}/Tasks/byStatus`, { params });
  }

  // TaskLines-specific methods
  getTaskLines(): Observable<any> {
    return this.http.get(`${API_URL}/TaskLines`);
  }

  getTaskLine(taskLineId: number): Observable<any> {
    return this.http.get(`${API_URL}/TaskLines/${taskLineId}`);
  }

  createTaskLine(taskId: number, taskLine: any): Observable<any> {
    return this.http.post(`${API_URL}/TaskLines/tasks/${taskId}/Tasklines`, taskLine);
  }

  updateTaskLine(taskLineId: number, taskLine: any): Observable<any> {
    return this.http.put(`${API_URL}/TaskLines/${taskLineId}`, taskLine);
  }

  deleteTaskLine(taskLineId: number): Observable<any> {
    return this.http.delete(`${API_URL}/TaskLines/${taskLineId}`);
  }

  getTaskLinesByTask(taskId: number): Observable<any> {
    return this.http.get(`${API_URL}/TaskLines/ByTask/${taskId}`);
  }

  // Other entity methods
  getProjects(): Observable<any> {
    return this.http.get(`${API_URL}/Projects`);
  }

  getEmployees(): Observable<any> {
    return this.http.get(`${API_URL}/Employees`);
  }

  getInventory(): Observable<any> {
    return this.http.get(`${API_URL}/Inventory`);
  }

  getCustomers(): Observable<any> {
    return this.http.get(`${API_URL}/Customers`);
  }

  getCars(): Observable<any> {
    return this.http.get(`${API_URL}/Cars`);
  }
}
