import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'customers', 
    loadComponent: () => import('./components/customers/customers.component').then(c => c.CustomersComponent),
    canActivate: [authGuard, adminGuard]
  },
  { 
    path: 'customers/:id', 
    loadComponent: () => import('./components/customer-details/customer-details.component').then(c => c.CustomerDetailsComponent),
    canActivate: [authGuard, adminGuard]
  },
  { 
    path: 'accounts', 
    loadComponent: () => import('./components/accounts/accounts.component').then(c => c.AccountsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'accounts/:id', 
    loadComponent: () => import('./components/account-details/account-details.component').then(c => c.AccountDetailsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'accounts/new/:type', 
    loadComponent: () => import('./components/account-form/account-form.component').then(c => c.AccountFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./components/profile/profile.component').then(c => c.ProfileComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'change-password', 
    loadComponent: () => import('./components/change-password/change-password.component').then(c => c.ChangePasswordComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'operations', 
    loadComponent: () => import('./components/operations/operations.component').then(c => c.OperationsComponent),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
