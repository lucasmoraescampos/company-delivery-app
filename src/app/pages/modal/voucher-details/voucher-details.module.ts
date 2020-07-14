import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VoucherDetailsPage } from './voucher-details.page';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { BrMaskerModule } from 'br-mask';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MoneyModule,
    BrMaskerModule,
    NgxLoadingModule
  ],
  declarations: [VoucherDetailsPage],
  entryComponents: [VoucherDetailsPage]
})
export class VoucherDetailsPageModule {}
