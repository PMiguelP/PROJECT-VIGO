import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss'],
})
export class NewEventComponent {
  constructor(private modalCtrl: ModalController) { }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
