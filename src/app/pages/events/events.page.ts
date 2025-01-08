import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { NewEventComponent } from '../../components/new-event/new-event.component';
import { EventDetailsComponent } from '../../components/event-details/event-details.component';

interface Participant {
  name: string;
  avatar: string;
}

export interface Event {
  title: string;
  description: string;
  location: string;
  date: string;
  image: string;
  participants: Participant[];
}

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage {
  hasData: boolean = false;

  eventsData: Event[] = [
    {
      title: 'Despedida solteiro Tobi',
      description: 'Umas semanas loucas..',
      location: 'New York',
      date: '2023-10-01',
      image: 'https://www.flightgift.com/media/wp/FG/2024/01/stag-do-party.webp',
      participants: [
        { name: 'TObi', avatar: 'https://via.placeholder.com/50' },
        { name: 'Renato', avatar: 'https://via.placeholder.com/50' },
      ],
    },
    {
      title: 'Bachelor Party 2',
      description: 'Description for Bachelor Party 2',
      location: 'Las Vegas',
      date: '2023-11-05',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyNL0B8aENqdsY9iDkMo2GNe48DHtt8KTwVg&s',
      participants: [
        { name: 'Alice Johnson', avatar: 'https://via.placeholder.com/50' },
        { name: 'Bob Brown', avatar: 'https://via.placeholder.com/50' },
      ],
    },
  ];

  constructor(private modalCtrl: ModalController, private toastCtrl: ToastController) {
    this.hasData = this.eventsData.length > 0;
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
      }
    });

    await modal.present();
  }

  async copyLink(event: Event) {
    const link = `https://example.com/events/${event.title.replace(/\s+/g, '-').toLowerCase()}`;
    await navigator.clipboard.writeText(link);

    const toast = await this.toastCtrl.create({
      message: 'Event link copied to clipboard!',
      duration: 2000,
      color: 'success',
    });
    await toast.present();
  }

  async openEventDetails(event: Event) {
    const modal = await this.modalCtrl.create({
      component: EventDetailsComponent,
      componentProps: { event },
      cssClass: 'event-details-modal',
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.deleted) {
        this.eventsData = this.eventsData.filter(e => e !== result.data.event);
        this.hasData = this.eventsData.length > 0;
      }
    });

    await modal.present();
  }
}