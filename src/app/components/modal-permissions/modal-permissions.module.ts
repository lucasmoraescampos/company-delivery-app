import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalPermissionsComponent } from './modal-permissions.component';
import { IonicModule } from '@ionic/angular';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalPaymentMethodsModule } from '../modal-payment-methods/modal-payment-methods.module';

@NgModule({
  declarations: [ModalPermissionsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ModalPaymentMethodsModule,
    NgxLoadingModule
  ]
})
export class ModalPermissionsModule { }
