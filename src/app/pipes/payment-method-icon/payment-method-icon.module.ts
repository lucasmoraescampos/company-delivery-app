import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentMethodIconPipe } from './payment-method-icon.pipe';

@NgModule({
  declarations: [PaymentMethodIconPipe],
  imports: [
    CommonModule
  ],
  exports: [PaymentMethodIconPipe]
})
export class PaymentMethodIconModule { }
