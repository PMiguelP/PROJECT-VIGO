import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationPickerPagePageRoutingModule } from './location-picker-page-routing.module';

import { LocationPickerPagePage } from './location-picker-page.page';

import { SharedModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationPickerPagePageRoutingModule,
    SharedModule,
  ],
  declarations: [LocationPickerPagePage],
})
export class LocationPickerPagePageModule {}
