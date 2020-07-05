import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderCodePipe } from './order-code.pipe';

@NgModule({
  declarations: [OrderCodePipe],
  imports: [
    CommonModule
  ],
  exports: [OrderCodePipe]
})
export class OrderCodeModule { }
