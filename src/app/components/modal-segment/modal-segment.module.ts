import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxLoadingModule } from 'ngx-loading';
import { ModalSegmentComponent } from './modal-segment.component';

@NgModule({
  declarations: [ModalSegmentComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule
  ]
})
export class ModalSegmentModule { }
