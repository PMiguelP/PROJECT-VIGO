import { Component, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Event } from '../../pages/events/events.page'; // Ajuste o caminho conforme necessário
import { EditEventComponent } from '../edit-event/edit-event.component';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent {
  @Input() event!: Event;

  constructor(private modalCtrl: ModalController, private toastCtrl: ToastController) { }

  async editEvent() {
    const modal = await this.modalCtrl.create({
      component: EditEventComponent,
      componentProps: { event: this.event },
      cssClass: 'edit-event-modal',
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        // Atualize os detalhes do evento conforme necessário
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
    // Notifique o componente pai sobre a exclusão do evento
    this.modalCtrl.dismiss({ deleted: true, event: this.event });

    const toast = await this.toastCtrl.create({
      message: 'Event deleted successfully!',
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}