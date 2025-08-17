// src/app/api.ts
import axios from 'axios';

import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
const API_URL = 'https://localhost:7188/api';


const http = inject(HttpClient);

export const login = (credentials: { username: string, password: string }) => {
  return http.post(`${API_URL}/Employees/Login`, credentials).toPromise();
};
