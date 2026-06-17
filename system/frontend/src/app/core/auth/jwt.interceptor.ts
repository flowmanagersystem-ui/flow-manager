// Angular
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// RxJS
import { catchError, throwError } from 'rxjs';

// Services
import { AuthService } from './auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const token = authService.getAccessToken()

  const request = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : req

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigate(['/login'])
      }

      return throwError(() => error)
    })
  )
}
