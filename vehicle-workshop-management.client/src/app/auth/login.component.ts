// src/app/auth/login.component.ts (Alternative version using AuthService)
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DxButtonModule, DxTextBoxModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, DxTextBoxModule, DxButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  onSubmit() {
    console.log('onSubmit called!'); // Debug log
    console.log('Username:', this.username, 'Password:', this.password); // Debug log

    if (!this.username || !this.password) {
      this.error = 'Please enter both username and password.';
      console.log('Validation failed'); // Debug log
      return;
    }

    this.isLoading = true;
    this.error = '';
    console.log('Starting login request...'); // Debug log

    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Login successful:', response); // Debug log
        // AuthService handles token storage
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Login error:', err);

        if (err.status === 401) {
          this.error = 'Invalid username or password.';
        } else if (err.status === 500) {
          this.error = 'Server error. Please try again later.';
        } else if (err.status === 0) {
          this.error = 'Unable to connect to server. Please check your connection.';
        } else {
          this.error = err.error?.message || 'Login failed. Please try again.';
        }
      },
      complete: () => {
        this.isLoading = false;
        console.log('Login request completed'); // Debug log
      }
    });
  }

  // Add a test method to verify click events work
  onTestClick() {
    console.log('Test button clicked!');
    alert('Button click is working!');
  }
}
