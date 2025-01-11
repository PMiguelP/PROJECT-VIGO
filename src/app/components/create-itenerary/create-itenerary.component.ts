import { Component, OnInit, Input } from '@angular/core';
import { EventService, Event } from '../../services/events/events.service';
import {
  ItineraryService,
  CreateItineraryDto,
  Itinerary,
} from '../../services/itenerarys/itenerarys.service';
import {
  ModalController,
  AlertController,
  ToastController,
} from '@ionic/angular'; // Import AlertController and ToastController
import {
  ChecklistService,
  Checklist,
} from '../../services/checklist/checklist.service';
import { CreateChecklistComponent } from '../../components/create-checklist/create-checklist.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-itenerary',
  templateUrl: './create-itenerary.component.html',
  styleUrls: ['./create-itenerary.component.scss'],
})
export class CreateIteneraryComponent implements OnInit {
  @Input() isEdit: boolean = false; // To indicate edit mode
  @Input() isViewOnly: boolean = false; // To indicate view mode
  @Input() itineraryData: Itinerary | CreateItineraryDto = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  };

  events: Event[] = [];
  checklists: Checklist[] = [];
  selectedEventId: string = '';

  constructor(
    private eventService: EventService,
    private itineraryService: ItineraryService,
    private checklistService: ChecklistService,
    private modalCtrl: ModalController,
    private router: Router,
    private alertCtrl: AlertController, // Inject AlertController
    private toastCtrl: ToastController // Inject ToastController
  ) {}

  ngOnInit() {
    this.loadEvents();
    this.loadChecklists();
  }

  loadEvents() {
    if (!this.isViewOnly) {
      this.eventService.getEvents().subscribe(
        (events) => {
          this.events = events;
        },
        (error) => {
          console.error('Error fetching events', error);
        }
      );
    }
  }

  loadChecklists() {
    if ('id' in this.itineraryData) {
      // Check if itineraryData has an id property
      this.checklistService
        .getChecklistsByItinerary(this.itineraryData.id)
        .subscribe(
          (checklists) => {
            this.checklists = checklists;
          },
          (error) => {
            console.error('Error loading checklists', error);
            this.showToast('Failed to load checklists', 'danger');
          }
        );
    } else {
      console.warn('No ID available on itineraryData to load checklists');
    }
  }

  onEventSelect(eventId: string) {
    const selectedEvent = this.events.find((event) => event.id === eventId);
    if (selectedEvent && !this.isEdit) {
    }
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  createItinerary() {
    if (this.selectedEventId) {
      const data: CreateItineraryDto = {
        name: this.itineraryData.name,
        description: this.itineraryData.description,
        startDate: this.formatDate(new Date(this.itineraryData.startDate)),
        endDate: this.formatDate(new Date(this.itineraryData.endDate)),
      };

      this.itineraryService
        .createItinerary(this.selectedEventId, data)
        .subscribe(
          (itinerary) => {
            this.modalCtrl.dismiss(itinerary); // Return the new itinerary
          },
          (error) => {
            this.showToast('Error creating itinerary', 'danger');
          }
        );
    }
  }

  updateItinerary() {
    const { id, ...updatedData } = this.itineraryData as Itinerary;
    const formattedData = {
      ...updatedData,
      startDate:
        updatedData.startDate instanceof Date
          ? updatedData.startDate.toISOString().split('T')[0]
          : updatedData.startDate,
      endDate:
        updatedData.endDate instanceof Date
          ? updatedData.endDate.toISOString().split('T')[0]
          : updatedData.endDate,
    };

    this.itineraryService.updateItinerary(id, formattedData).subscribe(
      (updatedItinerary) => {
        this.modalCtrl.dismiss(updatedItinerary);
      },
      (error) => {
        console.error('Error updating itinerary', error);
        this.showToast('Error updating itinerary', 'danger');
      }
    );
  }

  async openChecklistModal(checklistId: string) {
    const modal = await this.modalCtrl.create({
      component: CreateChecklistComponent,
      componentProps: { checklistId },
    });
    await modal.present();
  }

  goToChecklistPage(checklistId: string) {
    this.router
      .navigate(['/checklist'], { queryParams: { id: checklistId } })
      .then(() => {
        this.modalCtrl.dismiss(); // Dismiss the modal after navigation
      });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async openChecklistModal2(checklistId?: string) {
    // Use a type guard to check if itineraryData is an Itinerary
    const itineraryId =
      'id' in this.itineraryData ? this.itineraryData.id : undefined;

    if (!itineraryId) {
      console.warn(
        'No itinerary ID available to pass to the checklist component'
      );
      return;
    }

    const modal = await this.modalCtrl.create({
      // Use modalCtrl here
      component: CreateChecklistComponent,
      componentProps: {
        checklistId: checklistId || null, // Pass the checklist ID for editing (if any)
        itineraryId: itineraryId, // Pass the itinerary ID for creating
      },
    });

    modal.onDidDismiss().then(() => {
      // Refresh the checklists or perform any necessary post-modal actions
      this.loadChecklists();
    });

    await modal.present();
  }

  async deleteChecklist(checklistId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this checklist?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.checklistService.deleteChecklist(checklistId).subscribe({
              next: () => {
                this.checklists = this.checklists.filter(
                  (c) => c.id !== checklistId
                );
                this.showToast('Checklist deleted successfully');
              },
              error: (err) => {
                console.error('Error deleting checklist:', err);
                this.showToast('Failed to delete checklist', 'danger');
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }

  // Define the showToast method using ToastController
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color, // 'success' or 'danger'
    });
    toast.present();
  }
}
