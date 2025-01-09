import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service'; // Adjust the path if needed

@Component({
  selector: 'app-set-profile-picture',
  templateUrl: './set-profile-picture.page.html',
  styleUrls: ['./set-profile-picture.page.scss'],
})
export class SetProfilePicturePage implements OnInit {
  categories: {
    name: string;
    pictures: { url: string; id: number; description: string }[];
  }[] = []; // Store profile pictures grouped by category
  selectedImageId: number | null = null; // Track the selected image ID

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadPresetProfilePictures();
  }

  // Load preset profile pictures from the service
  loadPresetProfilePictures() {
    this.userService.getAllPresetProfilePictures().subscribe({
      next: (response) => {
        // Group pictures by category
        const groupedByCategory = response.reduce((acc: any, picture: any) => {
          const category = picture.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({
            url: picture.url,
            id: picture.id,
            description: picture.description || 'No description available',
          });
          return acc;
        }, {});

        // Transform into array for easier rendering
        this.categories = Object.keys(groupedByCategory).map((category) => ({
          name: category,
          pictures: groupedByCategory[category],
        }));
      },
      error: (err) => {
        console.error('Error loading preset profile pictures:', err);
      },
    });
  }

  // Handle image selection
  selectImage(imageId: number) {
    this.selectedImageId = imageId;

    // Call the service to select the image
    this.userService.selectProfilePicture(imageId).subscribe({
      next: (response) => {
        console.log('Profile picture selected successfully:', response);
      },
      error: (err) => {
        console.error('Error selecting profile picture:', err);
      },
    });
  }
}
