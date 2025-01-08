import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyItineraryPageRoutingModule } from './my-itinerary-routing.module';

import { MyItineraryPage } from './my-itinerary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyItineraryPageRoutingModule
  ],
  declarations: [MyItineraryPage]
})
export class MyItineraryPageModule {}
