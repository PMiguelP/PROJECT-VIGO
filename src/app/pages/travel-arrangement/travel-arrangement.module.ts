import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TravelArrangementPageRoutingModule } from './travel-arrangement-routing.module';

import { TravelArrangementPage } from './travel-arrangement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TravelArrangementPageRoutingModule
  ],
  declarations: [TravelArrangementPage]
})
export class TravelArrangementPageModule {}
