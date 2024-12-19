import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetProfilePicturePageRoutingModule } from './set-profile-picture-routing.module';

import { SetProfilePicturePage } from './set-profile-picture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetProfilePicturePageRoutingModule
  ],
  declarations: [SetProfilePicturePage]
})
export class SetProfilePicturePageModule {}
