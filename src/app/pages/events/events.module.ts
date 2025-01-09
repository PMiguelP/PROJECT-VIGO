import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EventsPageRoutingModule } from './events-routing.module';
import { EventsPage } from './events.page';
import { NewEventComponent } from '../../components/new-event/new-event.component';

import { SharedModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventsPageRoutingModule,
    SharedModule,
  ],
  declarations: [EventsPage, NewEventComponent],
})
export class EventsPageModule {}
