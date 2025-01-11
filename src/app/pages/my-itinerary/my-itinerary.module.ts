import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyItineraryPageRoutingModule } from './my-itinerary-routing.module';

import { MyItineraryPage } from './my-itinerary.page';

import { SharedModule } from '../../components/components.module';
import { CreateIteneraryComponent } from 'src/app/components/create-itenerary/create-itenerary.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MyItineraryPageRoutingModule,
    SharedModule,
  ],
  declarations: [MyItineraryPage, CreateIteneraryComponent],
})
export class MyItineraryPageModule {}
