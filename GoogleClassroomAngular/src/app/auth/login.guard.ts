import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = authService.getToken();

  // If token exists and is valid, redirect logged-in user to dashboard
  if (token && authService.isTokenValid()) {
    router.navigate(['/chatting-site']);
    return false; // prevent access to login page
  }

  // Otherwise allow access to login page
  return true;
};
