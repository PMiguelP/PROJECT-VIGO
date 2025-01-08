import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyItineraryPage } from './my-itinerary.page';

const routes: Routes = [
  {
    path: '',
    component: MyItineraryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyItineraryPageRoutingModule {}
