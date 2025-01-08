import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Event as AppEvent } from '../../pages/events/events.page'; // Ajuste o caminho conforme necessário

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent {
  @Input() event!: AppEvent;

  constructor(private modalCtrl: ModalController) { }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  saveEvent() {
    if (!this.event.image) {
      this.event.image = 'https://via.placeholder.com/150';
    }
    if (this.event.title && this.event.description) {
      this.modalCtrl.dismiss(this.event);
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.event.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}