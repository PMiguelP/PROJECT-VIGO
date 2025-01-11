import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ChecklistItemService,
  ChecklistItem,
} from '../../services/checklist-item/checklist-item.service';

@Component({
  selector: 'app-create-checklistitem',
  templateUrl: './create-checklistitem.component.html',
  styleUrls: ['./create-checklistitem.component.scss'],
})
export class CreateChecklistitemComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create'; // Determines the mode
  @Input() checklistId!: string; // For "Create" mode
  @Input() itemToEdit?: ChecklistItem; // For "Edit" mode

  checklistItemForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private checklistItemService: ChecklistItemService
  ) {}

  ngOnInit() {
    this.initializeForm();
    if (this.mode === 'edit' && this.itemToEdit) {
      this.populateForm();
    }
  }

  private initializeForm() {
    this.checklistItemForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      locationName: [''],
      locationAddress: [''],
      latitude: [null],
      longitude: [null],
      estimatedTime: [
        null,
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ],
      status: ['NOT_STARTED', [Validators.required]], // Add status with default
    });
  }

  private populateForm() {
    this.checklistItemForm.patchValue(this.itemToEdit!);
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  submitForm() {
    if (this.checklistItemForm.invalid) {
      console.log('Form is invalid:', this.checklistItemForm.errors);
      return;
    }

    const formData = this.checklistItemForm.value;

    // Convert `estimatedTime` to a number
    formData.estimatedTime = Number(formData.estimatedTime);

    // Log the data for debugging
    console.log('Form Data Submitted:', formData);

    this.isSubmitting = true;

    if (this.mode === 'create') {
      this.checklistItemService
        .createChecklistItem(this.checklistId, formData)
        .subscribe({
          next: () => {
            console.log('Checklist item created successfully!');
            this.modalController.dismiss({ success: true });
          },
          error: (error) => {
            console.error('Error creating checklist item:', error);
            this.isSubmitting = false;
          },
        });
    } else if (this.mode === 'edit' && this.itemToEdit) {
      this.checklistItemService
        .updateChecklistItem(this.itemToEdit.id, formData)
        .subscribe({
          next: () => {
            console.log('Checklist item updated successfully!');
            this.modalController.dismiss({ success: true });
          },
          error: (error) => {
            console.error('Error updating checklist item:', error);
            this.isSubmitting = false;
          },
        });
    }
  }
}
