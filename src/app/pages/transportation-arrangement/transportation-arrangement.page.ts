import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transportation-arrangement',
  templateUrl: './transportation-arrangement.page.html',
  styleUrls: ['./transportation-arrangement.page.scss'],
})
export class TransportationArrangementPage implements OnInit {
  tickets: string[] = ['Voo10', 'Voo10Volta'];

  flightData: {
    flag: string,
    countryCode: string,
    time: string,
    returnFlag: string,
    returnCountryCode: string,
    returnTime: string
  }[] = [
      { flag: 'CHN', countryCode: 'CHN', time: '21.03 6:00 AM', returnFlag: 'UK', returnCountryCode: 'UK', returnTime: '15.03 18:00 PM' },
      { flag: 'UK', countryCode: 'UK', time: '21.03 10:00 AM', returnFlag: 'CHN', returnCountryCode: 'CHN', returnTime: '25.03 20:00 PM' }
    ];


  constructor() { }

  ngOnInit() {
  }

  addTicket() {
    const newTicket = prompt('Enter the ticket name:');
    if (newTicket) {
      this.tickets.push(newTicket);
    }
  }

  determinePlan() {
    // Add your logic here to determine the plan
  }
}
