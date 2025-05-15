import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Replace this logic with your actual admin check
    const isAdmin = true; // TODO: Implement real admin check
    if (!isAdmin) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}