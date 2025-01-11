import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ChecklistService,
  Checklist,
} from '../../services/checklist/checklist.service';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-create-checklist',
  templateUrl: './create-checklist.component.html',
  styleUrls: ['./create-checklist.component.scss'],
})
export class CreateChecklistComponent implements OnInit {
  @Input() checklistId?: string; // Checklist ID for edit mode
  @Input() itineraryId = ''; // Itinerary ID for create mode
  checklistForm!: FormGroup;
  isUpdating = false;

  constructor(
    private formBuilder: FormBuilder,
    private checklistService: ChecklistService,
    private modalController: ModalController,
    private navParams: NavParams
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checklistId = this.navParams.get('checklistId') || this.checklistId;
    this.itineraryId = this.navParams.get('itineraryId') || this.itineraryId;

    // If checklistId is provided, load the checklist for editing
    if (this.checklistId) {
      this.isUpdating = true;
      this.loadChecklistData();
    }
  }

  private initForm(): void {
    this.checklistForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  private loadChecklistData(): void {
    this.checklistService.getChecklistById(this.checklistId!).subscribe({
      next: (checklist: Checklist) => {
        // Populate form with name and description only
        this.checklistForm.patchValue({
          name: checklist.name,
          description: checklist.description,
        });
      },
      error: (err) => console.error('Error loading checklist:', err),
    });
  }

  createChecklist(): void {
    if (this.checklistForm.invalid) return;

    const { name, description } = this.checklistForm.value;

    this.checklistService
      .createChecklist(this.itineraryId, name, description)
      .subscribe({
        next: (newChecklist: Checklist) => {
          console.log('Checklist created successfully:', newChecklist);
          this.dismissModal(); // Dismiss modal after successful creation
        },
        error: (err) => console.error('Error creating checklist:', err),
      });
  }

  updateChecklist(): void {
    if (this.checklistForm.invalid || !this.checklistId) return;

    const { name, description } = this.checklistForm.value;

    this.checklistService
      .updateChecklist(this.checklistId, name, description)
      .subscribe({
        next: (updatedChecklist: Checklist) => {
          console.log('Checklist updated successfully:', updatedChecklist);
          this.dismissModal(); // Dismiss modal after successful update
        },
        error: (err) => console.error('Error updating checklist:', err),
      });
  }

  dismissModal(): void {
    this.modalController.dismiss();
  }
}
