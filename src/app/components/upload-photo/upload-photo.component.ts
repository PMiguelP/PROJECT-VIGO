import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FileUploadService } from '../../services/upload/upload.service';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.scss'],
})
export class UploadPhotoComponent {
  @Input() checklistItemId!: string; // Input from parent component
  @Output() photoUploaded = new EventEmitter<void>();

  selectedFile: File | null = null;

  constructor(private fileUploadService: FileUploadService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async uploadFile() {
    if (!this.selectedFile) {
      return alert('Please select a file first!');
    }

    this.fileUploadService
      .uploadFile(this.selectedFile, this.checklistItemId)
      .subscribe({
        next: () => {
          alert('File uploaded successfully!');
          this.photoUploaded.emit(); // Notify parent component to refresh photos
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('Upload failed:', err);
          alert('Failed to upload the file.');
        },
      });
  }
}
