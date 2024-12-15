import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-tabs',
  templateUrl: './footer-tabs.component.html',
  styleUrls: ['./footer-tabs.component.scss'],
})
export class FooterTabsComponent implements OnInit {
  selectedTab: string = 'home'; // Default active tab

  constructor(private router: Router) {}

  ngOnInit() {}

  // Method to handle tab selection
  selectTab(tabName: string) {
    this.selectedTab = tabName;

    // Add navigation if needed
    switch (tabName) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'trips':
        this.router.navigate(['/trips']);
        break;
      case 'itinerary':
        this.router.navigate(['/itinerary']);
        break;
      case 'profile':
        this.router.navigate(['/profile']);
        break;
      default:
        break;
    }
  }
}
