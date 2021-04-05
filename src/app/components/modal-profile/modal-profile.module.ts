import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalProfileComponent } from './modal-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BrMaskerModule } from 'br-mask';
import { NgxLoadingModule } from 'ngx-loading';
import { ChooseImageModule } from '../choose-image/choose-image.module';

@NgModule({
  declarations: [ModalProfileComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ChooseImageModule,
    BrMaskerModule,
    NgxLoadingModule
  ]
})
export class ModalProfileModule { }
