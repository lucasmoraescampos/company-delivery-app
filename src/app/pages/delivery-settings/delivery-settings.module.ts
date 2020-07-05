import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DeliverySettingsPageRoutingModule } from './delivery-settings-routing.module';
import { DeliverySettingsPage } from './delivery-settings.page';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    BrMaskerModule,
    DeliverySettingsPageRoutingModule
  ],
  declarations: [DeliverySettingsPage]
})
export class DeliverySettingsPageModule {}
