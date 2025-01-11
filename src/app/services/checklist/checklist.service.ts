import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoadingController } from '@ionic/angular';

export interface Checklist {
  id: string;
  name: string;
  description: string;
  itineraryId: string;
  checklistItems?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  name: string;
  completed: boolean;
  checklistId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private checklists = new BehaviorSubject<Checklist[]>([]);
  public checklists$ = this.checklists.asObservable();

  private readonly apiUrl = `${environment.apiUrl}/checklist`;

  constructor(private loadingController: LoadingController) {
    axios.defaults.withCredentials = true;
  }

  private async showLoading(message: string) {
    const loading = await this.loadingController.create({ message });
    await loading.present();
    return loading;
  }

  createChecklist(
    itineraryId: string,
    name: string,
    description: string
  ): Observable<Checklist> {
    return new Observable<Checklist>((observer) => {
      this.showLoading('Creating checklist...').then((loading) => {
        from(
          axios.post(`${this.apiUrl}/itineraries/${itineraryId}`, {
            name,
            description,
          })
        )
          .pipe(
            map((response) => response.data),
            tap((checklist) => {
              const currentChecklists = this.checklists.getValue();
              this.checklists.next([...currentChecklists, checklist]);
            }),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (checklist) => {
              observer.next(checklist);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  getChecklistsByItinerary(itineraryId: string): Observable<Checklist[]> {
    return new Observable<Checklist[]>((observer) => {
      this.showLoading('Loading checklists...').then((loading) => {
        from(axios.get(`${this.apiUrl}/itineraries/${itineraryId}`))
          .pipe(
            map((response) => response.data),
            tap((checklists) => this.checklists.next(checklists)),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (checklists) => {
              observer.next(checklists);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  updateChecklist(
    checklistId: string,
    name: string,
    description: string
  ): Observable<Checklist> {
    return new Observable<Checklist>((observer) => {
      this.showLoading('Updating checklist...').then((loading) => {
        from(
          axios.put(`${this.apiUrl}/itineraries/update${checklistId}`, {
            name,
            description,
          })
        )
          .pipe(
            map((response) => response.data),
            tap((updatedChecklist) => {
              const currentChecklists = this.checklists.getValue();
              const index = currentChecklists.findIndex(
                (c) => c.id === checklistId
              );
              if (index !== -1) {
                currentChecklists[index] = updatedChecklist;
                this.checklists.next([...currentChecklists]);
              }
            }),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (updatedChecklist) => {
              observer.next(updatedChecklist);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  deleteChecklist(checklistId: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.showLoading('Deleting checklist...').then((loading) => {
        from(axios.delete(`${this.apiUrl}/itineraries/delete/${checklistId}`))
          .pipe(
            tap(() => {
              const currentChecklists = this.checklists.getValue();
              this.checklists.next(
                currentChecklists.filter((c) => c.id !== checklistId)
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

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => error.response?.data || error);
  }
}
