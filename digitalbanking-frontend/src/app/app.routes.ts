import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'customers', 
    loadComponent: () => import('./components/customers/customers.component').then(m => m.CustomersComponent) 
  },
  { 
    path: 'customers/:id', 
    loadComponent: () => import('./components/customer-details/customer-details.component').then(m => m.CustomerDetailsComponent) 
  },
  { 
    path: 'accounts', 
    loadComponent: () => import('./components/accounts/accounts.component').then(m => m.AccountsComponent) 
  },
  { 
    path: 'accounts/:id', 
    loadComponent: () => import('./components/account-details/account-details.component').then(m => m.AccountDetailsComponent) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) 
  },
  // Add a catch-all route to handle 404 errors
  { path: '**', redirectTo: 'dashboard' }
];
