import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterTabsComponent } from './footer-tabs/footer-tabs.component';

@NgModule({
  declarations: [FooterTabsComponent],
  imports: [CommonModule, IonicModule],
  exports: [FooterTabsComponent],
})
export class SharedModule {}
