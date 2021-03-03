import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalShareLinkComponent } from './modal-share-link.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ModalShareLinkComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ModalShareLinkModule { }
