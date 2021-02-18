import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuantityComponent } from './quantity.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [QuantityComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [QuantityComponent]
})
export class QuantityModule { }
