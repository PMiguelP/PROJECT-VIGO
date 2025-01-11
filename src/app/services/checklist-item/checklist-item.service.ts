import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoadingController } from '@ionic/angular';

export interface ChecklistItem {
  id: string;
  name: string;
  description: string;
  locationName?: string;
  locationAddress?: string;
  latitude?: number;
  longitude?: number;
  estimatedTime?: string;
  checklistId: string;
  status: 'NOT_STARTED' | 'COMPLETED';
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  private readonly apiUrl = `${environment.apiUrl}/item`;
  private checklistItems = new BehaviorSubject<ChecklistItem[]>([]);
  public checklistItems$ = this.checklistItems.asObservable();

  constructor(private loadingController: LoadingController) {
    axios.defaults.withCredentials = true;
  }

  private async showLoading(message: string) {
    const loading = await this.loadingController.create({ message });
    await loading.present();
    return loading;
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => error.response?.data || error);
  }

  getChecklistItems(checklistId: string): Observable<ChecklistItem[]> {
    return new Observable<ChecklistItem[]>((observer) => {
      this.showLoading('Loading checklist items...').then((loading) => {
        from(axios.get(`${this.apiUrl}/checklist/${checklistId}`))
          .pipe(
            map((response) => response.data),
            tap((items) => this.checklistItems.next(items)),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (items) => {
              observer.next(items);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }
  createChecklistItem(
    checklistId: string,
    data: Partial<ChecklistItem>
  ): Observable<ChecklistItem> {
    // Definir status padrão, caso não seja informado
    data.status = data.status || 'NOT_STARTED';

    return new Observable<ChecklistItem>((observer) => {
      this.showLoading('Creating checklist item...').then((loading) => {
        from(axios.post(`${this.apiUrl}/checklist/${checklistId}`, data))
          .pipe(
            map((response) => response.data),
            tap((newItem) => {
              const currentItems = this.checklistItems.getValue();
              this.checklistItems.next([...currentItems, newItem]);
            }),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (newItem) => {
              observer.next(newItem);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  updateChecklistItem(
    itemId: string,
    data: Partial<ChecklistItem>
  ): Observable<ChecklistItem> {
    return new Observable<ChecklistItem>((observer) => {
      this.showLoading('Updating checklist item...').then((loading) => {
        from(axios.put(`${this.apiUrl}/checklist/item/${itemId}`, data))
          .pipe(
            map((response) => response.data),
            tap((updatedItem) => {
              const currentItems = this.checklistItems.getValue();
              const index = currentItems.findIndex(
                (item) => item.id === itemId
              );
              if (index !== -1) {
                currentItems[index] = updatedItem;
                this.checklistItems.next([...currentItems]);
              }
            }),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (updatedItem) => {
              observer.next(updatedItem);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  deleteChecklistItem(itemId: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.showLoading('Deleting checklist item...').then((loading) => {
        from(axios.delete(`${this.apiUrl}/checklist/item/${itemId}`))
          .pipe(
            tap(() => {
              const currentItems = this.checklistItems.getValue();
              this.checklistItems.next(
                currentItems.filter((item) => item.id !== itemId)
              );
            }),
            map(() => void 0),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: () => {
              observer.next();
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  getChecklistItemPhotos(itemId: string): Observable<string[]> {
    return new Observable<string[]>((observer) => {
      this.showLoading('Loading photos...').then((loading) => {
        from(axios.get(`${this.apiUrl}/photos/${itemId}`))
          .pipe(
            map((response) => response.data.photos),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (photos) => {
              observer.next(photos);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }
}
