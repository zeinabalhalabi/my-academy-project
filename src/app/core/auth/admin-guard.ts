import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

export const AdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Is authenticated:', authService.isAuthenticated());
  console.log('Current user:', authService.currentUser);
  console.log('User role:', authService.currentUser?.userRole);

  if (
    authService.isAuthenticated() &&
    authService.currentUser?.userRole === 'admin'
  ) {
    console.log('Admin access granted');
    return true;
  }

  console.log('Admin access denied');
  return router.createUrlTree(['/home']);
};