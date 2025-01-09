import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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

  private readonly apiUrl = `${environment.apiUrl}/events`;

  constructor() {
    axios.defaults.withCredentials = true;
  }

  createEvent(eventData: CreateEventDto): Observable<Event> {
    return from(axios.post(`${this.apiUrl}/create`, eventData)).pipe(
      map((response) => response.data),
      tap((event) => {
        const currentEvents = this.events.getValue();
        this.events.next([...currentEvents, event]);
      }),
      catchError((error) => this.handleError(error))
    );
  }

  getEvents(): Observable<Event[]> {
    return from(axios.get(`${this.apiUrl}/all`)).pipe(
      map((response) => response.data),
      tap((events) => this.events.next(events)),
      catchError((error) => this.handleError(error))
    );
  }

  getEvent(id: string): Observable<Event> {
    return from(axios.get(`${this.apiUrl}/${id}`)).pipe(
      map((response) => response.data),
      catchError((error) => this.handleError(error))
    );
  }

  updateEvent(
    id: string,
    eventData: Partial<CreateEventDto>
  ): Observable<Event> {
    return from(axios.put(`${this.apiUrl}/${id}`, eventData)).pipe(
      map((response) => response.data),
      tap((updatedEvent) => {
        const currentEvents = this.events.getValue();
        const index = currentEvents.findIndex((e) => e.id === id);
        if (index !== -1) {
          currentEvents[index] = updatedEvent;
          this.events.next([...currentEvents]);
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

  deleteEvent(id: string): Observable<void> {
    return from(axios.delete(`${this.apiUrl}/delete/${id}`)).pipe(
      tap(() => {
        const currentEvents = this.events.getValue();
        this.events.next(currentEvents.filter((event) => event.id !== id));
      }),
      map(() => void 0),
      catchError((error) => this.handleError(error))
    );
  }

  updateShareLink(id: string): Observable<{ shareLink: string }> {
    return from(axios.put(`${this.apiUrl}/${id}/share`)).pipe(
      map((response) => response.data),
      catchError((error) => this.handleError(error))
    );
  }

  getEventParticipants(id: string): Observable<Participant[]> {
    return from(axios.get(`${this.apiUrl}/${id}/participants`)).pipe(
      map((response) => response.data),
      catchError((error) => this.handleError(error))
    );
  }

  respondToInvitation(
    eventId: string,
    response: 'CONFIRMED' | 'DECLINED'
  ): Observable<any> {
    return from(
      axios.patch(`${this.apiUrl}/${eventId}/respond`, { status: response })
    ).pipe(
      map((response) => response.data),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => error.response?.data || error);
  }
}
