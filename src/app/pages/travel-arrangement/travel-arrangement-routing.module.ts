import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TravelArrangementPage } from './travel-arrangement.page';

const routes: Routes = [
  {
    path: '',
    component: TravelArrangementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravelArrangementPageRoutingModule {}
