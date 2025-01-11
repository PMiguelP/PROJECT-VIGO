import { Injectable } from '@angular/core';
import axios from 'axios';
import {
  BehaviorSubject,
  Observable,
  from,
  throwError,
  of,
  forkJoin,
} from 'rxjs';
import { map, tap, catchError, finalize, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoadingController } from '@ionic/angular';
import { UserService } from '../user/user.service';

export interface Event {
  id: string;
  name: string;
  description: string;
  destiny: string;
  startDate: Date;
  endDate: Date;
  shareLink: string;
  createdById: string;
  participants: Participant[];
  itineraries?: Itinerary[];
  comments?: Comment[];
}

export interface Participant {
  userId: string;
  role: 'ORGANIZER' | 'PARTICIPANT';
  status: 'CONFIRMED' | 'PENDING' | 'DECLINED';
  name?: string; // Optional field for user's name
  presetProfilePictureUrl?: {
    url: string;
    description: string;
    category: string;
  };
}

export interface Itinerary {
  id: string;
}

export interface Comment {
  id: string;
}

export interface CreateEventDto {
  name: string;
  description: string;
  destiny: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private events = new BehaviorSubject<Event[]>([]);
  public events$ = this.events.asObservable();

  private readonly apiUrl = `${environment.apiUrl}/event`;

  constructor(
    private loadingController: LoadingController,
    private userService: UserService
  ) {
    axios.defaults.withCredentials = true;
  }

  async showLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
    });
    await loading.present();
    return loading;
  }

  createEvent(eventData: CreateEventDto): Observable<Event> {
    return new Observable<Event>((observer) => {
      this.showLoading('Creating event...').then((loading) => {
        from(axios.post(`${this.apiUrl}/create`, eventData))
          .pipe(
            map((response) => response.data),
            tap((event) => {
              const currentEvents = this.events.getValue();
              this.events.next([...currentEvents, event]);
            }),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (event) => {
              observer.next(event);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  getEvents(): Observable<Event[]> {
    return new Observable<Event[]>((observer) => {
      this.showLoading('Loading events...').then((loading) => {
        from(axios.get(`${this.apiUrl}/all`))
          .pipe(
            map((response) => response.data),
            tap((events) => this.events.next(events)),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (events) => {
              observer.next(events);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  getEvent(id: string): Observable<Event> {
    return new Observable<Event>((observer) => {
      this.showLoading('Loading event details...').then((loading) => {
        from(axios.get(`${this.apiUrl}/${id}`))
          .pipe(
            map((response) => response.data),
            switchMap((event: Event) => {
              if (event.participants && event.participants.length > 0) {
                const participantDetails$ = event.participants.map(
                  (participant) => this.getParticipantDetails(participant)
                );
                return forkJoin(participantDetails$).pipe(
                  map((participants) => {
                    event.participants = participants;
                    return event;
                  })
                );
              } else {
                return of(event);
              }
            }),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (event) => {
              observer.next(event);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  updateEvent(
    id: string,
    eventData: Partial<CreateEventDto>
  ): Observable<Event> {
    return new Observable<Event>((observer) => {
      this.showLoading('Updating event...').then((loading) => {
        from(axios.put(`${this.apiUrl}/${id}`, eventData))
          .pipe(
            map((response) => response.data),
            tap((updatedEvent) => {
              const currentEvents = this.events.getValue();
              const index = currentEvents.findIndex((e) => e.id === id);
              if (index !== -1) {
                currentEvents[index] = updatedEvent;
                this.events.next([...currentEvents]);
              }
            }),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (updatedEvent) => {
              observer.next(updatedEvent);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  deleteEvent(id: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.showLoading('Deleting event...').then((loading) => {
        from(axios.delete(`${this.apiUrl}/delete/${id}`))
          .pipe(
            tap(() => {
              const currentEvents = this.events.getValue();
              this.events.next(
                currentEvents.filter((event) => event.id !== id)
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

  private getParticipantDetails(
    participant: Participant
  ): Observable<Participant> {
    return this.userService.getUserInfoById(participant.userId).pipe(
      map((user) => {
        console.log(user); // Add this to see the structure of `user`
        return {
          ...participant,
          name: user.name,
          presetProfilePictureUrl: user.presetProfilePicture, // Adjust if necessary
        };
      }),
      catchError((error) => {
        console.error(
          `Failed to fetch user info for ${participant.userId}`,
          error
        );
        return of(participant); // Return the participant without additional details on error
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => error.response?.data || error);
  }
}
