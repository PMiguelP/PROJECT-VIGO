import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsPageRoutingModule } from './events-routing.module';

import { EventsPage } from './events.page';
import { NewEventComponent } from '../../components/new-event/new-event.component';
import { EventDetailsComponent } from '../../components/event-details/event-details.component'; // Importe o componente aqui

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventsPageRoutingModule
  ],
  declarations: [
    EventsPage,
    NewEventComponent,
    EventDetailsComponent // Adicione o componente aqui
  ]
})
export class EventsPageModule { }