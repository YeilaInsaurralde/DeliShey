import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';

export const adminGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Sin sesión (o vencida): se limpian los restos y va al login
  if (!authService.isLoggedIn()) {
    authService.logout();
    return router.createUrlTree(['/login']);
  }

  // Con sesión vigente y rol admin: pasa
  if (authService.isAdmin()) {
    return true;
  }

  // Con sesión pero sin ser admin: al inicio
  return router.createUrlTree(['/']);
};