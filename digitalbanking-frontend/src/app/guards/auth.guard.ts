import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated$.pipe(
    tap(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      }
    })
  );
};
