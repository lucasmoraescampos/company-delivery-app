import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalVariablesComponent } from './modal-variables.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  declarations: [ModalVariablesComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    BrMaskerModule,
    NgxLoadingModule
  ]
})
export class ModalVariablesModule { }
