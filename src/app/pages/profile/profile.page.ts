import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user$: Observable<User | null>;
  user: User | null = null;

  isEditing = false; // To control edit mode
  currentPassword = '';
  newPassword = '';

  placeholderImage = 'https://via.placeholder.com/150'; // Fake round profile image

  // Backup copy to revert changes
  private backupUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    this.user$.subscribe((user) => {
      this.user = user;
    });
  }

  // Enter editing mode
  toggleEditMode() {
    if (this.user) {
      this.backupUser = { ...this.user }; // Save a backup
    }
    this.isEditing = true;
  }

  // Cancel editing mode
  cancelEditMode() {
    if (this.backupUser) {
      this.user = { ...this.backupUser }; // Revert to backup
    }
    this.isEditing = false;
  }

  // Save changes
  saveChanges() {
    console.log('Saved user details:', this.user);
    console.log('New Password:', this.newPassword);
    this.isEditing = false; // Exit editing mode
    this.backupUser = null; // Clear backup
  }

  // Handle Profile Picture Click
  onProfilePictureClick() {
    if (this.isEditing) {
      // Navigate to set-profile-picture page
      this.router.navigate(['/set-profile-picture']);
    } else {
      console.log(
        'You must be in editing mode to change your profile picture.'
      );
    }
  }
}
