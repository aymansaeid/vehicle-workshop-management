import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { LoginComponent } from './auth/login.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeComponent,  // Your layout with navbar/drawer
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

    ]
  },
  { path: '**', component: NotFoundComponent }
];
