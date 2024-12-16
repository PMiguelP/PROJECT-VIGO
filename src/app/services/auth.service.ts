import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap, switchMap, filter, take, map } from 'rxjs/operators';
import { Router } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  accessToken?: string;
  message: string;
  isAuthenticated?: boolean;
  user?: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BASE_URL = 'http://localhost:3000';

  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSubject.asObservable();

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  checkAuth(): Observable<boolean> {
    return this.http
      .get<AuthResponse>(`${this.BASE_URL}/auth/check`, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this.authenticatedSubject.next(response.isAuthenticated || false);
          this.userSubject.next(response.user || null);
        }),
        map((response) => response.isAuthenticated || false),
        catchError((error) => {
          this.authenticatedSubject.next(false);
          this.userSubject.next(null);
          return of(false);
        })
      );
  }

  initializeAuth() {
    this.checkAuth().subscribe();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          this.authenticatedSubject.next(true);
          this.userSubject.next(response.user || null);
        }),
        catchError(this.handleError)
      );
  }

  register(
    email: string,
    password: string,
    name: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.BASE_URL}/auth/register`,
        { email, password, name },
        { withCredentials: true }
      )
      .pipe(
        switchMap(() => this.login(email, password)),
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.BASE_URL}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.authenticatedSubject.next(false);
          this.userSubject.next(null);
          this.router.navigate(['/login']);
        }),
        catchError(this.handleError)
      );
  }

  refreshToken(): Observable<string> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token): token is string => token !== null),
        take(1)
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.http
      .post<AuthResponse>(
        `${this.BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          this.isRefreshing = false;
          if (response.accessToken) {
            this.refreshTokenSubject.next(response.accessToken);
            this.checkAuth().subscribe();
          }
        }),
        map((response) => response.accessToken!),
        catchError((error) => {
          this.isRefreshing = false;
          this.authenticatedSubject.next(false);
          this.userSubject.next(null);
          return throwError(
            () => new Error('Session expired. Please log in again.')
          );
        })
      );
  }

  handleTokenExpiration() {
    return this.refreshToken().pipe(
      tap((accessToken) => {
        console.log('Access token refreshed successfully.');
      }),
      catchError((error) => {
        console.error('Failed to refresh token.', error);
        return throwError(error);
      })
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'Unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 500:
          errorMessage = 'Internal server error';
          break;
        default:
          errorMessage = `Error code ${error.status}: ${error.message}`;
      }
    }

    console.error('Authentication error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  };
}
