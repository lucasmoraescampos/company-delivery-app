import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatusPipe } from './order-status.pipe';

@NgModule({
  declarations: [OrderStatusPipe],
  imports: [
    CommonModule
  ],
  exports: [OrderStatusPipe]
})
export class OrderStatusModule { }
