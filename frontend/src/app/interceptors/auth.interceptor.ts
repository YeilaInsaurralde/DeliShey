import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  const request = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {

      // Si mandamos un token y el backend lo rechaza (401), la sesión ya no sirve
      if (error.status === 401 && token) {
        authService.logout();
        router.navigate(['/login']);
      }

      // El error se sigue propagando para que cada pantalla muestre su mensaje
      return throwError(() => error);
    })
  );
};