import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss'],
})
export class NewEventComponent {
  @Input() event = {
    title: '',
    description: '',
    location: '',
    date: '',
    itinerary: '',
    image: '',
    participants: [] as { name: string; avatar: string }[]
  };

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

  selectLocation(location: string) {
    this.event.location = location;
  }

  selectItinerary(itinerary: string) {
    this.event.itinerary = itinerary;
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