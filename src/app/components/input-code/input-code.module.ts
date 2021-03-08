import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputCodeComponent } from './input-code.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [InputCodeComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [InputCodeComponent]
})
export class InputCodeModule { }
