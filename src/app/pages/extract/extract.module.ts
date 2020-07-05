import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExtractPageRoutingModule } from './extract-routing.module';

import { ExtractPage } from './extract.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExtractPageRoutingModule
  ],
  declarations: [ExtractPage]
})
export class ExtractPageModule {}
