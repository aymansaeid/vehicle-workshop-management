import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./shared/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'customers',
    loadComponent: () => import('./features/customers/customer-list/customer-list.component')
      .then(m => m.CustomerListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'vehicles',
    loadComponent: () => import('./features/vehicles/vehicle-list/vehicle-list.component')
      .then(m => m.VehicleListComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
