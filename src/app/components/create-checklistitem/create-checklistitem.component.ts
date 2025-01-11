import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ChecklistItemService,
  ChecklistItem,
} from '../../services/checklist-item/checklist-item.service';
import { LocationPickerComponent } from '../location-picker/location-picker.component';

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
    console.log(`Component initialized in "${this.mode}" mode.`);
    console.log(`Checklist ID: ${this.checklistId}`);
    if (this.itemToEdit) {
      console.log('Editing item:', this.itemToEdit);
    }

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
      latitude: [
        null,
        [
          Validators.min(-90), // Latitude must be >= -90
          Validators.max(90), // Latitude must be <= 90
        ],
      ],
      longitude: [
        null,
        [
          Validators.min(-180), // Longitude must be >= -180
          Validators.max(180), // Longitude must be <= 180
        ],
      ],
      estimatedTime: [
        null,
        [Validators.required, Validators.pattern('^[0-9]+$')], // Numeric value
      ],
      status: ['NOT_STARTED', [Validators.required]], // Default status
    });

    console.log('Form initialized:', this.checklistItemForm.value);
  }

  private populateForm() {
    this.checklistItemForm.patchValue(this.itemToEdit!);
    console.log('Form populated with itemToEdit:', this.itemToEdit);
  }

  async closeModal() {
    console.log('Modal closed.');
    await this.modalController.dismiss();
  }

  submitForm() {
    console.log('Submit button clicked.');

    // Check if the form is invalid and log any errors
    if (this.checklistItemForm.invalid) {
      console.error('Form is invalid. Errors:', this.checklistItemForm.errors);
      Object.keys(this.checklistItemForm.controls).forEach((key) => {
        console.error(
          `Field "${key}" errors:`,
          this.checklistItemForm.get(key)?.errors
        );
      });
      return;
    }

    // Prepare the form data
    const formData = this.checklistItemForm.value;
    formData.estimatedTime = formData.estimatedTime
      ? Number(formData.estimatedTime)
      : null;
    formData.latitude = formData.latitude ? Number(formData.latitude) : null;
    formData.longitude = formData.longitude ? Number(formData.longitude) : null;

    console.log('Form Data Ready for Submission:', formData);

    // Ensure latitude and longitude are valid before submitting
    if (
      formData.latitude !== null &&
      (formData.latitude < -90 || formData.latitude > 90)
    ) {
      console.error('Invalid latitude:', formData.latitude);
      alert('Latitude must be between -90 and 90.');
      return;
    }
    if (
      formData.longitude !== null &&
      (formData.longitude < -180 || formData.longitude > 180)
    ) {
      console.error('Invalid longitude:', formData.longitude);
      alert('Longitude must be between -180 and 180.');
      return;
    }

    this.isSubmitting = true;

    if (this.mode === 'create') {
      console.log('Creating new checklist item...');
      this.checklistItemService
        .createChecklistItem(this.checklistId, formData)
        .subscribe({
          next: (response) => {
            console.log(
              'Checklist item created successfully. Response:',
              response
            );
            this.modalController.dismiss({ success: true });
          },
          error: (error) => {
            console.error('Error while creating checklist item:', error);
            console.error('Backend response (error body):', error.error);
            this.isSubmitting = false;
          },
        });
    } else if (this.mode === 'edit' && this.itemToEdit) {
      console.log('Updating existing checklist item...');
      this.checklistItemService
        .updateChecklistItem(this.itemToEdit.id, formData)
        .subscribe({
          next: (response) => {
            console.log(
              'Checklist item updated successfully. Response:',
              response
            );
            this.modalController.dismiss({ success: true });
          },
          error: (error) => {
            console.error('Error while updating checklist item:', error);
            console.error('Backend response (error body):', error.error);
            this.isSubmitting = false;
          },
        });
    }
  }

  async openLocationPicker() {
    const modal = await this.modalController.create({
      component: LocationPickerComponent, // Reference your location picker component
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const { name, address, latitude, longitude } = result.data;
        // Update the form with the selected location details
        this.checklistItemForm.patchValue({
          locationName: name,
          locationAddress: address,
          latitude: latitude,
          longitude: longitude,
        });
      }
    });

    await modal.present();
  }
}
