import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../auth.service';
import { LoadingController } from '@ionic/angular';

export interface PresetProfilePicture {
  id: number;
  url: string;
  description: string;
  category: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private loadingController: LoadingController
  ) {}

  async showLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
    });
    await loading.present();
    return loading;
  }

  getUserInfo(): Observable<User> {
    return new Observable((observer) => {
      this.showLoading('Loading user info...').then((loading) => {
        this.http
          .get<User>(`${this.apiUrl}/user/info`, this.getHeaders())
          .pipe(
            catchError(this.handleError),
            finalize(() => loading.dismiss()) // Ensure loading is dismissed
          )
          .subscribe({
            next: (user) => {
              observer.next(user);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  getAllPresetProfilePictures(): Observable<PresetProfilePicture[]> {
    return new Observable((observer) => {
      this.showLoading('Loading profile pictures...').then((loading) => {
        this.http
          .get<PresetProfilePicture[]>(
            `${this.apiUrl}/user/profile-pictures`,
            this.getHeaders()
          )
          .pipe(
            catchError(this.handleError),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (pictures) => {
              observer.next(pictures);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  selectProfilePicture(presetProfilePictureId: number): Observable<User> {
    return new Observable((observer) => {
      this.showLoading('Updating profile picture...').then((loading) => {
        this.http
          .post<User>(
            `${this.apiUrl}/user/profile-pictures/select`,
            { presetProfilePictureId },
            this.getHeaders()
          )
          .pipe(
            catchError(this.handleError),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (user) => {
              observer.next(user);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  updateUserProfile(params: {
    currentPassword: string;
    newPassword?: string;
    newName?: string;
  }): Observable<User> {
    return new Observable((observer) => {
      this.showLoading('Saving profile changes...').then((loading) => {
        this.http
          .put<User>(
            `${this.apiUrl}/user/profile-update`,
            params,
            this.getHeaders()
          )
          .pipe(
            catchError(this.handleError),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (user) => {
              observer.next(user);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status} - ${
        error.error?.error || error.statusText
      }`;
    }

    console.error('UserService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getUserInfoById(userId: string): Observable<User> {
    return new Observable((observer) => {
      this.showLoading('Loading user info...').then((loading) => {
        this.http
          .get<User>(`${this.apiUrl}/user/info/${userId}`, this.getHeaders()) // Call to the new endpoint with userId
          .pipe(
            catchError(this.handleError),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (user) => {
              observer.next(user);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }
}
