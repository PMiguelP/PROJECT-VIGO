import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoadingController } from '@ionic/angular';

export interface Itinerary {
  id: string;
  eventId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  checklists: any[];
}

export interface CreateItineraryDto {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class ItineraryService {
  private readonly apiUrl = `${environment.apiUrl}/teste`;

  constructor(private loadingController: LoadingController) {
    axios.defaults.withCredentials = true;
  }

  async showLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
    });
    await loading.present();
    return loading;
  }

  createItinerary(
    eventId: string,
    itineraryData: CreateItineraryDto
  ): Observable<Itinerary> {
    return new Observable<Itinerary>((observer) => {
      this.showLoading('Creating itinerary...').then((loading) => {
        from(
          axios.post(
            `${this.apiUrl}/events/${eventId}/itineraries`,
            itineraryData
          )
        )
          .pipe(
            map((response) => response.data),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (itinerary) => {
              observer.next(itinerary);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  getItinerariesByEvent(eventId: string): Observable<Itinerary[]> {
    return new Observable<Itinerary[]>((observer) => {
      this.showLoading('Loading itineraries...').then((loading) => {
        from(axios.get(`${this.apiUrl}/events/${eventId}/itineraries`))
          .pipe(
            map((response) => response.data),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (itineraries) => {
              observer.next(itineraries);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  updateItinerary(
    id: string,
    itineraryData: Partial<CreateItineraryDto>
  ): Observable<Itinerary> {
    return new Observable<Itinerary>((observer) => {
      this.showLoading('Updating itinerary...').then((loading) => {
        from(
          axios.put(
            `${environment.apiUrl}/itineraries/update/${id}`,
            itineraryData
          )
        )
          .pipe(
            map((response) => response.data),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (updatedItinerary) => {
              observer.next(updatedItinerary);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      });
    });
  }

  deleteItinerary(id: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.showLoading('Deleting itinerary...').then((loading) => {
        from(
          axios.delete(`${environment.apiUrl}/teste/itineraries/delete/${id}`)
        ) // Updated endpoint
          .pipe(
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

  getUserItineraries(): Observable<Itinerary[]> {
    return new Observable<Itinerary[]>((observer) => {
      this.showLoading('Loading your itineraries...').then((loading) => {
        from(axios.get(`${environment.apiUrl}/teste/user/itineraries`))
          .pipe(
            map((response) => response.data),
            catchError((error) => this.handleError(error)),
            finalize(() => loading.dismiss())
          )
          .subscribe({
            next: (itineraries) => {
              observer.next(itineraries);
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
