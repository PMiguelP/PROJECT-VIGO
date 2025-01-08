import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItineraryFormPageRoutingModule } from './itinerary-form-routing.module';

import { ItineraryFormPage } from './itinerary-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItineraryFormPageRoutingModule
  ],
  declarations: [ItineraryFormPage]
})
export class ItineraryFormPageModule {}
