import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      req.url.includes('/auth/login') ||
      req.url.includes('/auth/register') ||
      req.url.includes('/auth/refresh')
    ) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return from(this.handleUnauthorizedError(req, next));
        }
        return throwError(() => error);
      })
    );
  }

  private async handleUnauthorizedError(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any>> {
    try {
      const newAccessToken = await firstValueFrom(
        this.authService.refreshToken()
      );

      const modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });

      return await firstValueFrom(next.handle(modifiedReq));
    } catch (refreshError) {
      this.authService.logout();
      throw refreshError;
    }
  }
}
