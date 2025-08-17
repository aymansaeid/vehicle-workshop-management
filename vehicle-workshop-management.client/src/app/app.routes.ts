// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard], // Use the proper auth guard
    loadComponent: () => import('./shared/home/home.component').then(m => m.HomeComponent),
    children: [
      {
        path: 'customers',
        loadComponent: () => import('./features/customers/customer-list/customer-list.component')
          .then(m => m.CustomerListComponent)
      },
      {
        path: 'vehicles',
        loadComponent: () => import('./features/vehicles/vehicle-list/vehicle-list.component')
          .then(m => m.VehicleListComponent)
      },
      // Default route
      { path: '', pathMatch: 'full', redirectTo: 'customers' }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
