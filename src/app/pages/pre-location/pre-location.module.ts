import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreLocationPageRoutingModule } from './pre-location-routing.module';

import { PreLocationPage } from './pre-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreLocationPageRoutingModule
  ],
  declarations: [PreLocationPage]
})
export class PreLocationPageModule {}
