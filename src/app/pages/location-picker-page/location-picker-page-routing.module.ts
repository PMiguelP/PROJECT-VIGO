import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationPickerPagePage } from './location-picker-page.page';

const routes: Routes = [
  {
    path: '',
    component: LocationPickerPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationPickerPagePageRoutingModule {}
