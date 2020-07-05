import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentMethodPipe } from './payment-method.pipe';

@NgModule({
  declarations: [PaymentMethodPipe],
  imports: [
    CommonModule
  ],
  exports: [PaymentMethodPipe]
})
export class PaymentMethodModule { }
