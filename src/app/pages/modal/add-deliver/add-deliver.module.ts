import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDeliverPageRoutingModule } from './add-deliver-routing.module';

import { AddDeliverPage } from './add-deliver.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddDeliverPageRoutingModule
  ],
  declarations: [AddDeliverPage]
})
export class AddDeliverPageModule {}
