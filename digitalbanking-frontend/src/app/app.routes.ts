import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  
  // Protected routes - require authentication
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'customers', 
    loadComponent: () => import('./components/customers/customers.component').then(m => m.CustomersComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'customer/:id', 
    loadComponent: () => import('./components/customer-details/customer-details.component').then(m => m.CustomerDetailsComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'customer/new', 
    loadComponent: () => import('./components/customer-form/customer-form.component').then(m => m.CustomerFormComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'customer/edit/:id', 
    loadComponent: () => import('./components/customer-form/customer-form.component').then(m => m.CustomerFormComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'accounts', 
    loadComponent: () => import('./components/accounts/accounts.component').then(m => m.AccountsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'account/:id', 
    loadComponent: () => import('./components/account-details/account-details.component').then(m => m.AccountDetailsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'account/new/:type', 
    loadComponent: () => import('./components/account-form/account-form.component').then(m => m.AccountFormComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'operations/:accountId', 
    loadComponent: () => import('./components/operations/operations.component').then(m => m.OperationsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  
  // Wildcard route for 404
  { path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
