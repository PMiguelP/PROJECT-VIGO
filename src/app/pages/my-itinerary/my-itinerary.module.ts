import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyItineraryPageRoutingModule } from './my-itinerary-routing.module';

import { MyItineraryPage } from './my-itinerary.page';

import { SharedModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyItineraryPageRoutingModule,
    SharedModule,
  ],
  declarations: [MyItineraryPage],
})
export class MyItineraryPageModule {}
