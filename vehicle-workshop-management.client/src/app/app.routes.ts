import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'customers',
    loadComponent: () =>
      import('./features/customers/customer-list/customer-list.component')
        .then(m => m.CustomerListComponent),
  },
  {
    path: 'vehicles',
    loadComponent: () =>
      import('./features/vehicles/vehicle-list/vehicle-list.component')
        .then(m => m.VehicleListComponent),
  },
  { path: '**', component: NotFoundComponent },
];
