import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventParticipantsPageRoutingModule } from './event-participants-routing.module';

import { EventParticipantsPage } from './event-participants.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventParticipantsPageRoutingModule
  ],
  declarations: [EventParticipantsPage]
})
export class EventParticipantsPageModule {}
