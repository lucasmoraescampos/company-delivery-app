import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VouchersPageRoutingModule } from './vouchers-routing.module';
import { VouchersPage } from './vouchers.page';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { AddVoucherPageModule } from '../modal/add-voucher/add-voucher.module';
import { VoucherDetailsPageModule } from '../modal/voucher-details/voucher-details.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VouchersPageRoutingModule,
    MoneyModule,
    AddVoucherPageModule,
    VoucherDetailsPageModule
  ],
  declarations: [VouchersPage]
})
export class VouchersPageModule {}
