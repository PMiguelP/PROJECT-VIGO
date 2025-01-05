import { Component, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { NewEventComponent } from '../new-event/new-event.component';

interface Participant {
  name: string;
  avatar: string;
}

interface Event {
  title: string;
  description: string;
  location: string;
  date: string;
  image: string;
  participants: Participant[];
}

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent {
  @Input() event!: Event;

  constructor(private modalCtrl: ModalController, private toastCtrl: ToastController) { }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async editEvent() {
    const modal = await this.modalCtrl.create({
      component: NewEventComponent,
      componentProps: { event: this.event },
      cssClass: 'new-event-modal',
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        this.event = result.data;
        const toast = await this.toastCtrl.create({
          message: 'Event edited successfully!',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
      }
    });

    await modal.present();
  }

  async deleteEvent() {
    // Logic to delete the event
    const toast = await this.toastCtrl.create({
      message: 'Event deleted successfully!',
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
    this.closeModal();
  }

  setItinerary() {
    console.log('Set itinerary for event:', this.event);
    // Implement set itinerary logic here
  }
}