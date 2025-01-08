import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user$: Observable<User | null>;
  greetingMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    this.setGreetingMessage();
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
}
