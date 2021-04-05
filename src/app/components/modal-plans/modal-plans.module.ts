import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalPlansComponent } from './modal-plans.component';
import { IonicModule } from '@ionic/angular';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ModalPlansComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    NgxLoadingModule
  ]
})
export class ModalPlansModule { }
