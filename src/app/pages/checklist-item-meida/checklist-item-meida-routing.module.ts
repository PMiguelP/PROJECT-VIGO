import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChecklistItemMeidaPage } from './checklist-item-meida.page';

const routes: Routes = [
  {
    path: '',
    component: ChecklistItemMeidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChecklistItemMeidaPageRoutingModule {}
