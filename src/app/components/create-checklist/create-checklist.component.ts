import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ChecklistService,
  Checklist,
} from '../../services/checklist/checklist.service';
import { ModalController, NavParams } from '@ionic/angular'; // Import NavParams

@Component({
  selector: 'app-create-checklist',
  templateUrl: './create-checklist.component.html',
  styleUrls: ['./create-checklist.component.scss'],
})
export class CreateChecklistComponent implements OnInit {
  checklistForm!: FormGroup;
  isUpdating = false;
  checklistIdToUpdate = '';
  itineraryId = ''; // Add this property to store itineraryId

  constructor(
    private formBuilder: FormBuilder,
    private checklistService: ChecklistService,
    private modalController: ModalController,
    private navParams: NavParams // Inject NavParams to access modal props
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Retrieve the passed itineraryId from NavParams
    this.itineraryId = this.navParams.get('itineraryId');
    console.log('Received itineraryId:', this.itineraryId);
  }

  private initForm(): void {
    this.checklistForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  createChecklist(): void {
    if (this.checklistForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const { name, description } = this.checklistForm.value;

    if (!this.itineraryId) {
      console.error('itineraryId is missing');
      return;
    }

    this.checklistService
      .createChecklist(this.itineraryId, name, description)
      .subscribe({
        next: (newChecklist: Checklist) => {
          console.log('Checklist created successfully:', newChecklist);
          this.dismissModal(); // Dismiss the modal on success
        },
        error: (err) => console.error('Error creating checklist:', err),
      });
  }

  updateChecklist(): void {
    if (this.checklistForm.invalid || !this.checklistIdToUpdate) {
      console.error('Form is invalid or checklist ID is missing');
      return;
    }

    const { name, description } = this.checklistForm.value;

    this.checklistService
      .updateChecklist(this.checklistIdToUpdate, name, description)
      .subscribe({
        next: (updatedChecklist: Checklist) => {
          console.log('Checklist updated successfully:', updatedChecklist);
          this.dismissModal(); // Dismiss the modal on success
        },
        error: (err) => console.error('Error updating checklist:', err),
      });
  }

  // Dismiss the modal
  dismissModal(): void {
    this.modalController.dismiss();
  }
}
