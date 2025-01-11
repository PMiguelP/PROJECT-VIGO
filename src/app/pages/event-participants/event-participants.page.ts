import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  EventService,
  Participant,
} from '../../services/events/events.service';

@Component({
  selector: 'app-event-participants',
  templateUrl: './event-participants.page.html',
  styleUrls: ['./event-participants.page.scss'],
})
export class EventParticipantsPage implements OnInit {
  eventId: string | null = null;
  participants: Participant[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.queryParams['id'];
    if (this.eventId) {
      this.loadParticipants(this.eventId);
    } else {
      this.error = 'Event ID is missing.';
      this.isLoading = false;
    }
  }

  loadParticipants(eventId: string) {
    this.eventService.getEvent(eventId).subscribe({
      next: (event) => {
        this.participants = event.participants || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching event participants:', err);
        this.error = 'Failed to load participants.';
        this.isLoading = false;
      },
    });
  }
}
