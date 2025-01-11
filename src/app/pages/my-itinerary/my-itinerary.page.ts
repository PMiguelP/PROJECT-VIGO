import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular'; // Import AlertController
import { CreateIteneraryComponent } from '../../components/create-itenerary/create-itenerary.component';
import {
  ItineraryService,
  Itinerary,
} from '../../services/itenerarys/itenerarys.service';

@Component({
  selector: 'app-my-itinerary',
  templateUrl: './my-itinerary.page.html',
  styleUrls: ['./my-itinerary.page.scss'],
})
export class MyItineraryPage implements OnInit {
  hasData: boolean = false;
  itineraries: Itinerary[] = [];

  constructor(
    private modalCtrl: ModalController,
    private itineraryService: ItineraryService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadUserItineraries();
  }

  async loadUserItineraries() {
    this.itineraryService.getUserItineraries().subscribe({
      next: (itineraries) => {
        this.itineraries = itineraries;
        this.hasData = this.itineraries.length > 0;
      },
      error: (err) => {
        console.error('Failed to load itineraries', err);
        this.hasData = false;
      },
    });
  }

  async openNewEventModal() {
    const modal = await this.modalCtrl.create({
      component: CreateIteneraryComponent,
      cssClass: 'new-event-modal',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.loadUserItineraries(); // Reload itineraries after adding a new one
    }
  }

  async viewItinerary(itinerary: Itinerary) {
    const modal = await this.modalCtrl.create({
      component: CreateIteneraryComponent,
      cssClass: 'new-event-modal',
      componentProps: {
        isViewOnly: true,
        itineraryData: itinerary,
      },
    });
    await modal.present();
  }

  async editItinerary(itinerary: Itinerary) {
    const modal = await this.modalCtrl.create({
      component: CreateIteneraryComponent,
      cssClass: 'new-event-modal',
      componentProps: {
        isEdit: true,
        itineraryData: itinerary,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.itineraryService
          .updateItinerary(itinerary.id, result.data)
          .subscribe({
            next: (updatedItinerary) => {
              const index = this.itineraries.findIndex(
                (i) => i.id === itinerary.id
              );
              if (index !== -1) {
                this.itineraries[index] = updatedItinerary;
              }
            },
            error: (err) => {
              console.error('Failed to update itinerary:', err);
            },
          });
      }
    });

    await modal.present();
  }

  async deleteItinerary(itinerary: Itinerary) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete "${itinerary.name}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.itineraryService.deleteItinerary(itinerary.id).subscribe({
              next: () => {
                this.itineraries = this.itineraries.filter(
                  (i) => i.id !== itinerary.id
                );
                this.hasData = this.itineraries.length > 0;
              },
              error: (err) => {
                console.error('Failed to delete itinerary:', err);
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }
}
