import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoadingController } from '@ionic/angular';

export interface Comment {
  id: string;
  userId: string;
  commentType: string;
  eventId?: string;
  checklistItemId?: string;
  comment: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly apiUrl = `${environment.apiUrl}/comment`;
  private comments = new BehaviorSubject<Comment[]>([]);
  public comments$ = this.comments.asObservable();

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

  // Get all comments with optional filters
  getComments(queryParams?: {
    eventId?: string;
    checklistItemId?: string;
    userId?: string;
  }): Observable<Comment[]> {
    return new Observable<Comment[]>((observer) => {
      const queryString = queryParams
        ? '?' +
          Object.entries(queryParams)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')
        : '';

      this.showLoading('Loading comments...').then((loading) => {
        from(axios.get(`${this.apiUrl}/all${queryString}`))
          .pipe(
            map((response) => response.data),
            tap((comments) => this.comments.next(comments)),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (comments) => {
              observer.next(comments);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  // Get all comments for a specific event
  getCommentsForEvent(eventId: string): Observable<Comment[]> {
    return new Observable<Comment[]>((observer) => {
      this.showLoading('Loading comments for event...').then((loading) => {
        from(axios.get(`${this.apiUrl}/event/${eventId}`))
          .pipe(
            map((response) => response.data),
            tap((comments) => this.comments.next(comments)),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (comments) => {
              observer.next(comments);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  // Get all comments for a specific checklist item
  getCommentsForChecklistItem(checklistItemId: string): Observable<Comment[]> {
    return new Observable<Comment[]>((observer) => {
      this.showLoading('Loading comments for checklist item...').then(
        (loading) => {
          from(axios.get(`${this.apiUrl}/checklist-item/${checklistItemId}`))
            .pipe(
              map((response) => response.data),
              tap((comments) => this.comments.next(comments)),
              catchError((error) => this.handleError(error)),
              finalize(() => loading.dismiss())
            )
            .subscribe({
              next: (comments) => {
                observer.next(comments);
                observer.complete();
              },
              error: (error) => observer.error(error),
            });
        }
      );
    });
  }

  getCommentById(id: string): Observable<Comment> {
    return new Observable<Comment>((observer) => {
      this.showLoading('Loading comment...').then((loading) => {
        from(axios.get(`${this.apiUrl}/${id}`))
          .pipe(
            map((response) => response.data),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (comment) => {
              observer.next(comment);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  createComment(data: Partial<Comment>): Observable<Comment> {
    return new Observable<Comment>((observer) => {
      this.showLoading('Creating comment...').then((loading) => {
        from(axios.post(this.apiUrl, data))
          .pipe(
            map((response) => response.data),
            tap((newComment) => {
              const currentComments = this.comments.getValue();
              this.comments.next([...currentComments, newComment]);
            }),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (newComment) => {
              observer.next(newComment);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  updateComment(id: string, data: Partial<Comment>): Observable<Comment> {
    return new Observable<Comment>((observer) => {
      this.showLoading('Updating comment...').then((loading) => {
        from(axios.patch(`${this.apiUrl}/update/${id}`, data))
          .pipe(
            map((response) => response.data),
            tap((updatedComment) => {
              const currentComments = this.comments.getValue();
              const index = currentComments.findIndex(
                (comment) => comment.id === id
              );
              if (index !== -1) {
                currentComments[index] = updatedComment;
                this.comments.next([...currentComments]);
              }
            }),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (updatedComment) => {
              observer.next(updatedComment);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  deleteComment(id: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.showLoading('Deleting comment...').then((loading) => {
        from(axios.delete(`${this.apiUrl}/delete/${id}`))
          .pipe(
            tap(() => {
              const currentComments = this.comments.getValue();
              this.comments.next(
                currentComments.filter((comment) => comment.id !== id)
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
}
