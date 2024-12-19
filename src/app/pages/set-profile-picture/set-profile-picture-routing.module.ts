import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetProfilePicturePage } from './set-profile-picture.page';

const routes: Routes = [
  {
    path: '',
    component: SetProfilePicturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetProfilePicturePageRoutingModule {}
