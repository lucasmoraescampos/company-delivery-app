import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputCodeComponent } from './input-code.component';
import { IonicModule } from '@ionic/angular';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  declarations: [InputCodeComponent],
  imports: [
    CommonModule,
    IonicModule,
    BrMaskerModule
  ],
  exports: [InputCodeComponent]
})
export class InputCodeModule { }
