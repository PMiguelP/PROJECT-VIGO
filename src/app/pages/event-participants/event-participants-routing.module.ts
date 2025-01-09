import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventParticipantsPage } from './event-participants.page';

const routes: Routes = [
  {
    path: '',
    component: EventParticipantsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventParticipantsPageRoutingModule {}
