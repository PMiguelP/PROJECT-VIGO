import { Component } from '@angular/core';

@Component({
  selector: 'app-itinerary-form',
  templateUrl: './itinerary-form.page.html',
  styleUrls: ['./itinerary-form.page.scss']
})
export class ItineraryFormPage {
  selectedDay = 1;
  days = [
    { number: 1, date: 'July 14' },
    { number: 2, date: 'July 15' },
    { number: 3, date: 'July 16' }
  ];

  // Definindo um tipo mais seguro para o itineraryData
  itineraryData: {
    [key: number]: { time: string; title: string; subtitle: string; weather: string }[];
  } = {
      1: [
        { time: '09:00', title: 'Morning Yoga', subtitle: 'Start the day with relaxation', weather: '☀️' },
        { time: '11:30', title: 'Coral Reef Snorkeling', subtitle: 'Explore underwater life', weather: '🌊' },
        { time: '18:00', title: 'Sunset Cruise', subtitle: 'Enjoy a beautiful sunset', weather: '🌅' }
      ],
      2: [
        { time: '10:00', title: 'Beach Volleyball', subtitle: 'Fun in the sand', weather: '☀️' },
        { time: '13:00', title: 'Seafood Lunch', subtitle: 'Taste fresh local seafood', weather: '🌤️' },
        { time: '20:00', title: 'Star Gazing', subtitle: 'A night under the stars', weather: '🌌' }
      ],
      3: [
        { time: '08:00', title: 'Hiking Adventure', subtitle: 'Discover scenic trails', weather: '🌄' },
        { time: '12:00', title: 'Picnic by the Lake', subtitle: 'Relax with a picnic', weather: '🍉' },
        { time: '19:00', title: 'Farewell Dinner', subtitle: 'Celebrate the journey', weather: '🎉' }
      ]
    };

  // Garantir que a variável seja sempre um array
  get itineraryItems() {
    return this.itineraryData[this.selectedDay] || [];
  }

  selectDay(dayNumber: number) {
    this.selectedDay = dayNumber;
  }

  shouldShowCheckMark(itemTime: string): boolean {
    const currentTime = new Date();
    const [hours, minutes] = itemTime.split(':').map(Number);
    const itemTimeDate = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      hours,
      minutes
    );

    return currentTime >= itemTimeDate;
  }
}
