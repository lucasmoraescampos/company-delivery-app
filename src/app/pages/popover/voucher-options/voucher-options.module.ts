import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VoucherOptionsPage } from './voucher-options.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [VoucherOptionsPage],
  entryComponents: [VoucherOptionsPage]
})
export class VoucherOptionsPageModule {}
