import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItineraryFormPage } from './itinerary-form.page';

const routes: Routes = [
  {
    path: '',
    component: ItineraryFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItineraryFormPageRoutingModule {}
