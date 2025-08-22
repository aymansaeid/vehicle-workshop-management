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
        path: 'Customers-Cars',
        loadComponent: () => import('./features/customers/customers-cars/customers-cars.component')
          .then(m => m.CustomersCarsComponent)
      },
      {
        path: 'Inventory',
        loadComponent: () => import('./features/Inventory/inventore-list/inventore-list.component')
          .then(m => m.InventoreListComponent)
      },
      {
        path: 'Invoices',
        loadComponent: () => import('./features/Invoices/invoices-list/invoices-list.component')
          .then(m => m.InvoicesListComponent)
      },
      {
        path: 'Tasks',
        loadComponent: () => import('./features/Tasks/tasks-list/tasks-list.component')
          .then(m => m.TasksListComponent)
      },
      {
        path: 'Projects',
        loadComponent: () => import('./features/Projects/projects-list/projects-list.component')
          .then(m => m.ProjectsListComponent)
      },
      {
        path: 'Employees',
        loadComponent: () => import('./features/Employees/employees-list/employees-list.component')
          .then(m => m.EmployeesListComponent)
      },
      {
        path: 'Attendance',
        loadComponent: () => import('./features/attendance/attendance.component')
          .then(m => m.AttendanceComponent)
      },

      { path: '**', redirectTo: '/login' }
    ]
  }
];
