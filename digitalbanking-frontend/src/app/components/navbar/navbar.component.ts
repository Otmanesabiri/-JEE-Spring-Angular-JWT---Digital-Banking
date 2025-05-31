import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark modern-navbar">
      <div class="container-fluid">
        <a class="navbar-brand brand-logo" routerLink="/">
          <i class="bi bi-bank me-2"></i>Digital Banking
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item" *ngIf="isLoggedIn">
              <a class="nav-link modern-nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="bi bi-speedometer2 me-1"></i>Dashboard
              </a>
            </li>
            <li class="nav-item" *ngIf="isLoggedIn && isAdmin">
              <a class="nav-link modern-nav-link" routerLink="/customers" routerLinkActive="active">
                <i class="bi bi-people me-1"></i>Customers
              </a>
            </li>
            <li class="nav-item" *ngIf="isLoggedIn">
              <a class="nav-link modern-nav-link" routerLink="/accounts" routerLinkActive="active">
                <i class="bi bi-credit-card me-1"></i>Accounts
              </a>
            </li>
            <li class="nav-item" *ngIf="isLoggedIn">
              <a class="nav-link modern-nav-link" routerLink="/operations" routerLinkActive="active">
                <i class="bi bi-arrow-left-right me-1"></i>Operations
              </a>
            </li>
          </ul>
          <ul class="navbar-nav" *ngIf="!isLoggedIn">
            <li class="nav-item">
              <a class="nav-link modern-nav-link" routerLink="/login" routerLinkActive="active">
                <i class="bi bi-box-arrow-in-right me-1"></i>Login
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link modern-nav-link" routerLink="/register" routerLinkActive="active">
                <i class="bi bi-person-plus me-1"></i>Register
              </a>
            </li>
          </ul>
          <ul class="navbar-nav" *ngIf="isLoggedIn">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle user-dropdown" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle me-1"></i>{{ username }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end modern-dropdown" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" routerLink="/profile"><i class="bi bi-person me-2"></i>Profile</a></li>
                <li><a class="dropdown-item" routerLink="/change-password"><i class="bi bi-key me-2"></i>Change Password</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" (click)="logout($event)"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .modern-navbar {
      background: linear-gradient(135deg, #654321 0%, #8B4513 100%);
      box-shadow: 0 4px 6px -1px rgba(139, 69, 19, 0.1), 0 2px 4px -1px rgba(139, 69, 19, 0.06);
      border-bottom: 3px solid #A0522D;
    }

    .brand-logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #F5F5DC !important;
      text-decoration: none;
    }

    .modern-nav-link {
      color: #F5F5DC !important;
      font-weight: 500;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      margin: 0 0.25rem;
    }

    .modern-nav-link:hover,
    .modern-nav-link.active {
      background: linear-gradient(135deg, #A0522D 0%, #CD7F32 100%);
      color: #FFFFFF !important;
      transform: translateY(-2px);
    }

    .user-dropdown {
      background: linear-gradient(135deg, #6F4E37 0%, #8B4513 100%);
      border-radius: 8px;
      padding: 0.5rem 1rem;
    }

    .modern-dropdown {
      background: #FFFFFF;
      border: none;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(139, 69, 19, 0.1), 0 4px 6px -2px rgba(139, 69, 19, 0.05);
    }

    .dropdown-item {
      color: #654321;
      padding: 0.75rem 1.5rem;
      transition: all 0.3s ease;
    }

    .dropdown-item:hover {
      background: linear-gradient(135deg, #F5F5DC 0%, #D2B48C 100%);
      color: #654321;
    }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  username = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = this.authService.isAdmin();
      this.username = user?.username || '';
    });
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
