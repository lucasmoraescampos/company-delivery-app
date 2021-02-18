import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputCodeComponent } from './input-code.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InputCodeComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [InputCodeComponent]
})
export class InputCodeModule { }
