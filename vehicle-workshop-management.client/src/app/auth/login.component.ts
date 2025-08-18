import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private api: ApiService, private router: Router) {
    // If already logged in, redirect to dashboard
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn === 'true') {
      this.router.navigate(['/dashboard']);
    }
  }

  // Method to completely logout - you can call this from other components
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('loggedIn');
    localStorage.clear();
    this.router.navigate(['/login']);
  }


  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Please enter username and password';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.api.login(this.username, this.password).subscribe({
      next: (res: any) => {
        if (res && res.employeeId) {
          localStorage.setItem('user', JSON.stringify(res));
          localStorage.setItem('loggedIn', 'true');
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Invalid response from server';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Invalid username or password';
        this.isLoading = false;
      }
    });
  }
}
