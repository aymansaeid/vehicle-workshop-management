import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // For [(ngModel)]
import { HttpClientModule } from '@angular/common/http'; // Axios needs this

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login.component';
import { CustomersCarsComponent } from './features/customers-cars/customers-cars.component';
import { InventoreListComponent } from './features/Inventory/inventore-list/inventore-list.component';
import { InvoicesListComponent } from './features/Invoices/invoices-list/invoices-list.component';
import { TasksListComponent } from './features/Tasks/tasks-list/tasks-list.component'; 

@NgModule({
  declarations: [AppComponent, LoginComponent, CustomersCarsComponent, InventoreListComponent, InvoicesListComponent, TasksListComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
