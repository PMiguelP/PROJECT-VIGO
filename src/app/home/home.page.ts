import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { User } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user: User | null = null;
  greetingMessage: string = '';
  placeholderImage: string = 'https://via.placeholder.com/150'; // Fallback image

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.setGreetingMessage();
    this.loadUserInfo();
  }

  setGreetingMessage() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      this.greetingMessage = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      this.greetingMessage = 'Good Afternoon';
    } else {
      this.greetingMessage = 'Good Night';
    }
  }

  loadUserInfo() {
    this.userService.getUserInfo().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.error('Error loading user info:', err);
      },
    });
  }
}
