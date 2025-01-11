import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private readonly apiUrl = `${environment.apiUrl}/upload`;

  constructor(private loadingController: LoadingController) {
    axios.defaults.withCredentials = true;
  }

  private async showLoading(message: string) {
    const loading = await this.loadingController.create({ message });
    await loading.present();
    return loading;
  }

  uploadFile(file: File, checklistItemId: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.showLoading('Uploading file...').then((loading) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('checklistItemId', checklistItemId);

        from(
          axios.post(`${this.apiUrl}/upload-photo`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        )
          .pipe(
            map((response) => response.data),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (uploadResponse) => {
              observer.next(uploadResponse);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => error.response?.data || error);
  }
}
