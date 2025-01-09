import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventService } from '../../services/events/events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss'],
})
export class NewEventComponent implements OnInit {
  @Input() isEdit = false;
  @Input() isViewOnly = false;
  @Input() eventData?: any;

  event = {
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
  };

  errorMessages = {
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
  };

  constructor(
    private modalCtrl: ModalController,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit() {
    if ((this.isEdit || this.isViewOnly) && this.eventData) {
      const formatDate = (date: string | Date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
      };

      this.event = {
        title: this.eventData.name,
        description: this.eventData.description || '',
        location: this.eventData.destiny,
        startDate: formatDate(this.eventData.startDate),
        endDate: formatDate(this.eventData.endDate),
      };
    }
  }

  goToParticipants() {
    if (this.eventData?.id) {
      this.router.navigate(['/event-participants}', this.eventData.id]);
      console.log(this.eventData.id);
    } else {
      console.error('Event data is missing or invalid.');
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  validateInput(): boolean {
    if (this.isViewOnly) return true;

    this.errorMessages = {
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
    };

    if (!this.event.title.trim()) {
      this.errorMessages.title = 'Event name is required.';
    } else if (this.event.title.trim().length > 255) {
      this.errorMessages.title = 'Event name must be less than 255 characters.';
    }
    if (this.event.description && this.event.description.trim().length > 1000) {
      this.errorMessages.description =
        'Description must be less than 1000 characters.';
    }

    if (!this.event.location.trim()) {
      this.errorMessages.location = 'Location is required.';
    } else if (this.event.location.trim().length > 255) {
      this.errorMessages.location =
        'Location must be less than 255 characters.';
    }

    const startDate = new Date(this.event.startDate);
    const endDate = new Date(this.event.endDate);
    if (!this.event.startDate) {
      this.errorMessages.startDate = 'Start Date is required.';
    } else if (!this.isEdit && startDate < new Date()) {
      this.errorMessages.startDate = 'Start Date cannot be in the past.';
    }
    if (!this.event.endDate) {
      this.errorMessages.endDate = 'End Date is required.';
    } else if (endDate <= startDate) {
      this.errorMessages.endDate = 'End Date must be after Start Date.';
    }

    return Object.values(this.errorMessages).every((msg) => msg === '');
  }

  saveEvent() {
    if (this.validateInput()) {
      const eventData = {
        name: this.event.title.trim(),
        description: this.event.description?.trim(),
        destiny: this.event.location.trim(),
        startDate: new Date(this.event.startDate).toISOString(),
        endDate: new Date(this.event.endDate).toISOString(),
      };

      if (this.isEdit && this.eventData) {
        this.eventService.updateEvent(this.eventData.id, eventData).subscribe({
          next: (updatedEvent) => {
            console.log('Event updated successfully:', updatedEvent);
            this.modalCtrl.dismiss(updatedEvent);
          },
          error: (error) => {
            console.error('Error updating event:', error);
          },
        });
      } else if (!this.isViewOnly) {
        this.eventService.createEvent(eventData).subscribe({
          next: (newEvent) => {
            console.log('Event created successfully:', newEvent);
            this.modalCtrl.dismiss(newEvent);
          },
          error: (error) => {
            console.error('Error creating event:', error);
          },
        });
      }
    }
  }
}
