import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  ToastController,
  AlertController,
} from '@ionic/angular';
import { EventService, Event } from '../../services/events/events.service';
import { NewEventComponent } from '../../components/new-event/new-event.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  hasData: boolean = false;
  eventsData: Event[] = [];

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  private loadEvents() {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.eventsData = events;
        this.hasData = this.eventsData.length > 0;
      },
      error: (err) => {
        console.error('Failed to load events:', err);
        this.hasData = false;
      },
    });
  }

  async openNewEventModal() {
    const modal = await this.modalCtrl.create({
      component: NewEventComponent,
      cssClass: 'new-event-modal',
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.eventsData.push(result.data);
        this.hasData = this.eventsData.length > 0;
        this.showToast('Event created successfully');
      }
    });

    await modal.present();
  }

  async editEvent(event: Event) {
    const modal = await this.modalCtrl.create({
      component: NewEventComponent,
      cssClass: 'new-event-modal',
      componentProps: {
        isEdit: true,
        eventData: event,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const index = this.eventsData.findIndex((e) => e.id === event.id);
        if (index !== -1) {
          this.eventsData[index] = result.data;
        }
        this.showToast('Event updated successfully');
      }
    });

    await modal.present();
  }

  async viewEvent(event: Event) {
    const modal = await this.modalCtrl.create({
      component: NewEventComponent,
      cssClass: 'new-event-modal',
      componentProps: {
        isViewOnly: true,
        eventData: event,
      },
    });

    await modal.present();
  }

  async deleteEvent(event: Event) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete "${event.name}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.eventService.deleteEvent(event.id).subscribe({
              next: () => {
                this.eventsData = this.eventsData.filter(
                  (e) => e.id !== event.id
                );
                this.hasData = this.eventsData.length > 0;
                this.showToast('Event deleted successfully');
              },
              error: (err) => {
                console.error('Failed to delete event:', err);
                this.showToast('Failed to delete event', 'danger');
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  async copyLink(event: Event) {
    const link = `https://example.com/events/${event.name
      .replace(/\s+/g, '-')
      .toLowerCase()}`;
    await navigator.clipboard.writeText(link);

    await this.showToast('Event link copied to clipboard!');
  }
}
