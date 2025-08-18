import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { DrawerComponent } from './drawer/drawer.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./auth/login.component')
      .then(m => m.LoginComponent)
  },

  // 🔑 Drawer layout wrapper
  {
    path: '',
    component: DrawerComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./shared/home/home.component')
          .then(m => m.HomeComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/customers/customer-list/customer-list.component')
          .then(m => m.CustomerListComponent)
      },
      {
        path: 'vehicles',
        loadComponent: () => import('./features/vehicles/vehicle-list/vehicle-list.component')
          .then(m => m.VehicleListComponent)
      }
    ]
  },

  { path: '**', redirectTo: '/login' }
];
