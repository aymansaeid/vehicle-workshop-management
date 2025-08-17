import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // For [(ngModel)]
import { HttpClientModule } from '@angular/common/http'; // Axios needs this

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login.component'; 

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
