import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddProductPage } from './add-product.page';
import { BrMaskerModule } from 'br-mask';
import { SelectSessionPageModule } from '../select-session/select-session.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    ReactiveFormsModule,
    SelectSessionPageModule
  ],
  declarations: [AddProductPage],
  entryComponents: [AddProductPage]
})
export class AddProductPageModule {}
