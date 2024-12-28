import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewEventComponent } from '../../components/new-event/new-event.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage {
  constructor(private modalCtrl: ModalController) { }

  async openNewEventModal() {
    const modal = await this.modalCtrl.create({
      component: NewEventComponent,
      cssClass: 'new-event-modal',
    });
    await modal.present();
  }
}
