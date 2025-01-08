import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransportationArrangementPageRoutingModule } from './transportation-arrangement-routing.module';

import { TransportationArrangementPage } from './transportation-arrangement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransportationArrangementPageRoutingModule
  ],
  declarations: [TransportationArrangementPage]
})
export class TransportationArrangementPageModule {}
