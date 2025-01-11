import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { ModalController } from '@ionic/angular';
import {
  ChecklistItem,
  ChecklistItemService,
} from '../../services/checklist-item/checklist-item.service';
import { CreateChecklistitemComponent } from '../../components/create-checklistitem/create-checklistitem.component';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {
  selectedSegment = 'NOT_STARTED'; // Updated default value
  checklistItems: ChecklistItem[] = [];
  checklistId: string | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private checklistItemService: ChecklistItemService,
    private router: Router // Inject Router to navigate
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.checklistId = params['id'];
      if (this.checklistId) {
        this.loadChecklistItems(this.checklistId);
      }
    });
  }

  loadChecklistItems(checklistId: string) {
    this.isLoading = true;
    this.checklistItemService.getChecklistItems(checklistId).subscribe({
      next: (items) => {
        this.checklistItems = items;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load checklist items', err);
        this.isLoading = false;
      },
    });
  }

  async createModal(mode: 'create' | 'edit', itemToEdit?: ChecklistItem) {
    const modal = await this.modalController.create({
      component: CreateChecklistitemComponent,
      componentProps: {
        mode: mode,
        checklistId: this.checklistId,
        itemToEdit: itemToEdit,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.success) {
        this.loadChecklistItems(this.checklistId!);
      }
    });

    await modal.present();
  }

  moveTask(item: ChecklistItem) {
    const newStatus =
      item.status === 'NOT_STARTED' ? 'COMPLETED' : 'NOT_STARTED';

    // Call the service to update the status
    this.checklistItemService
      .updateChecklistItem(item.id, { status: newStatus })
      .subscribe({
        next: (updatedItem) => {
          // Update the local checklist item to reflect the change
          const index = this.checklistItems.findIndex((i) => i.id === item.id);
          if (index !== -1) {
            this.checklistItems[index] = updatedItem;
          }
        },
        error: (err) => console.error('Failed to update item status', err),
      });
  }

  get filteredTasks() {
    return this.checklistItems.filter(
      (item) => item.status === this.selectedSegment
    );
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  // Updated goMediaPage function
  goMediaPage(checklistItemId: string) {
    // Navigate to the Media Page, passing the checklistItemId
    this.router
      .navigate(['/checklist-item-meida'], {
        queryParams: { checklistItemId: checklistItemId },
      })
      .then(() => {
        console.log(
          'Navigated to Media Page with checklistItemId:',
          checklistItemId
        );
      })
      .catch((error) => {
        console.error('Navigation failed', error);
      });
  }
}
