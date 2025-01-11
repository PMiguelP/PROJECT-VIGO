import { Component, OnInit, Input } from '@angular/core';
import { EventService, Event } from '../../services/events/events.service';
import {
  ItineraryService,
  CreateItineraryDto,
  Itinerary,
} from '../../services/itenerarys/itenerarys.service';
import { ModalController } from '@ionic/angular';
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
    private router: Router
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
            alert('Failed to load checklists');
          }
        );
    } else {
      console.warn('No ID available on itineraryData to load checklists');
    }
  }

  onEventSelect(eventId: string) {
    const selectedEvent = this.events.find((event) => event.id === eventId);
    if (selectedEvent && !this.isEdit) {
      this.itineraryData.name = selectedEvent.name;
      this.itineraryData.description = selectedEvent.description;
      this.itineraryData.startDate = this.formatDate(selectedEvent.startDate);
      this.itineraryData.endDate = this.formatDate(selectedEvent.endDate);
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
            alert('Itinerary created successfully!');
            this.modalCtrl.dismiss(itinerary); // Return the new itinerary
          },
          (error) => {
            console.error('Error creating itinerary', error);
            alert('Error creating itinerary');
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
        alert('Itinerary updated successfully!');
        this.modalCtrl.dismiss(updatedItinerary); // Return the updated itinerary
      },
      (error) => {
        console.error('Error updating itinerary', error);
        alert('Error updating itinerary');
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
}
