// import { CanActivateFn } from '@angular/router';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { jwtDecode } from 'jwt-decode'; // Ensure the jwt-decode library is installed
// import { AuthService } from './auth.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const authService = inject(AuthService); // Injecting AuthService
//   const token = authService.getToken(); // Call the getToken method to retrieve the token

//   if (!token) {
//     router.navigate(['/auth/login']);
//     return false;
//   }

//   try {
//     const decoded: any = jwtDecode(token);
//     const now = Math.floor(new Date().getTime() / 1000);

//     if (decoded.exp && decoded.exp < now) {
//       console.log('Token expired — redirecting to login');
//       localStorage.removeItem('token');
//       router.navigate(['/auth/login']);
//       return false;
//     } else {
//       const timeLeft = decoded.exp - now;
//       console.log(`Token valid. Time left: ${timeLeft} seconds.`);
//       console.log("Token : " + token);
//     }
//   } catch (err) {
//     console.log('Invalid token — redirecting to login');
//     localStorage.removeItem('token');
//     router.navigate(['/auth/login']);
//     return false;
//   }

//   return true;
// };

import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token || !authService.isTokenValid()) {
    handleInvalidToken(router);
    return false;
  }

  return true;
};

// Helper to clean token and redirect
function handleInvalidToken(router: Router): void {
  localStorage.removeItem('token');
  router.navigate(['/auth/login']);
}
