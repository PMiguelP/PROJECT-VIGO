import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChecklistPageRoutingModule } from './checklist-routing.module';

import { ChecklistPage } from './checklist.page';

import { CreateChecklistitemComponent } from '../../components/create-checklistitem/create-checklistitem.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChecklistPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ChecklistPage, CreateChecklistitemComponent],
})
export class ChecklistPageModule {}
