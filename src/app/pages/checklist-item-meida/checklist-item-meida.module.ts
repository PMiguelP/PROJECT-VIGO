import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChecklistItemMeidaPageRoutingModule } from './checklist-item-meida-routing.module';

import { ChecklistItemMeidaPage } from './checklist-item-meida.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChecklistItemMeidaPageRoutingModule
  ],
  declarations: [ChecklistItemMeidaPage]
})
export class ChecklistItemMeidaPageModule {}
