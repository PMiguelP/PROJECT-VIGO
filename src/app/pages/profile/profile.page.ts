import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user/user.service';
import { Observable } from 'rxjs';
import { User } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user$: Observable<User | null>;
  user: User | null = null;

  isEditing = false;
  currentPassword = '';
  newPassword = '';

  placeholderImage = 'https://via.placeholder.com/150';

  private backupUser: User | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    this.user$.subscribe((user) => {
      this.user = user;
    });
    this.loadUserInfo();
  }

  private loadUserInfo() {
    this.userService.getUserInfo().subscribe({
      next: (user) => {
        this.user = user;
        this.authService.user$.subscribe((authUser) => {
          if (!authUser || authUser.id !== user.id) {
            this.authService['userSubject'].next(user);
          }
        });
      },
      error: (err) => {
        console.error('Error loading user info:', err);
      },
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

    if (this.user && this.currentPassword) {
      this.userService
        .updateUserProfile({
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
          newName: this.user.name,
        })
        .subscribe({
          next: (updatedUser) => {
            this.user = updatedUser;
            console.log('User updated successfully:', updatedUser);
            this.isEditing = false;
            this.backupUser = null;
          },
          error: (err) => {
            console.error('Error updating user:', err);
          },
        });
    } else {
      console.warn('Missing current password or user details.');
    }
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

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logged out successfully.');
        // Optionally, display a toast or confirmation message
      },
      error: (err) => {
        console.error('Error during logout:', err);
      },
    });
  }
}
