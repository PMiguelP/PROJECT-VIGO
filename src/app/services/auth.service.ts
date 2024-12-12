import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BASE_URL = 'http://localhost:3000';

  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSubject.asObservable();

  private userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  checkAuth() {
    return this.http
      .get(`${this.BASE_URL}/auth/check`, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          this.authenticatedSubject.next(response.isAuthenticated);
          this.userSubject.next(response.user || null);
        })
      );
  }

  initializeAuth() {
    this.checkAuth().subscribe({
      error: () => {
        console.log('Usuário não autenticado ao iniciar a aplicação.');
        this.authenticatedSubject.next(false);
        this.userSubject.next(null);
      },
    });
  }

  login(email: string, password: string) {
    return this.http
      .post(
        `${this.BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(tap(() => this.checkAuth().subscribe()));
  }

  register(email: string, password: string, name: string) {
    return this.http
      .post(
        `${this.BASE_URL}/auth/register`,
        { email, password, name },
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          this.login(email, password).subscribe();
        })
      );
  }

  logout() {
    return this.http
      .post(`${this.BASE_URL}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.authenticatedSubject.next(false);
          this.userSubject.next(null);
        })
      );
  }
}
