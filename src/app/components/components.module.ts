import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterTabsComponent } from './footer-tabs/footer-tabs.component';
import { LocationPickerComponent } from './location-picker/location-picker.component';

@NgModule({
  declarations: [FooterTabsComponent, LocationPickerComponent],
  imports: [CommonModule, IonicModule],
  exports: [FooterTabsComponent, LocationPickerComponent],
})
export class SharedModule {}
