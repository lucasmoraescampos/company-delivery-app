import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalPaymentMethodsComponent } from './modal-payment-methods.component';
import { IonicModule } from '@ionic/angular';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ModalPaymentMethodsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule
  ]
})
export class ModalPaymentMethodsModule { }
