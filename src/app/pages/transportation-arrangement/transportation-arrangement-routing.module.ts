import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransportationArrangementPage } from './transportation-arrangement.page';

const routes: Routes = [
  {
    path: '',
    component: TransportationArrangementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransportationArrangementPageRoutingModule {}
