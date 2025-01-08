import { Component } from '@angular/core';

@Component({
  selector: 'app-my-itinerary',
  templateUrl: './my-itinerary.page.html',
  styleUrls: ['./my-itinerary.page.scss'],
})
export class MyItineraryPage {
  hasData: boolean = false;

  tripsData = [
    {
      title: 'Tobi’s bachelor party',
      image: 'assets/images/pdf-icon.png',
    },
    {
      title: 'Tobi’s bachelor party',
      image: 'assets/images/globe-with-plane.png',
    },
  ];


  constructor() {
    this.hasData = this.tripsData.length > 0;
  }

  addTrip() {
    console.log('Add trip clicked');
  }
}
