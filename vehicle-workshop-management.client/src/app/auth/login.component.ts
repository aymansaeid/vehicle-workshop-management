import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  DxButtonModule,
  DxTextBoxModule,
  DxValidatorModule,
  DxFormModule,
  DxValidationGroupModule,
} from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { ClickEvent } from 'devextreme/ui/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    DxButtonModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxFormModule,
    DxValidationGroupModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private router: Router) { }

  onSubmit() {
    // Add your actual authentication logic here
    localStorage.setItem('isLoggedIn', 'true');
    this.router.navigate(['/']); // Will now properly redirect to customers via the guard
  }
}
