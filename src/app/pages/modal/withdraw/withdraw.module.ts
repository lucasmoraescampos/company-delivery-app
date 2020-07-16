import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WithdrawPage } from './withdraw.page';
import { BrMaskerModule } from 'br-mask';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { BankAccountPageModule } from '../bank-account/bank-account.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    MoneyModule,
    BankAccountPageModule
  ],
  declarations: [WithdrawPage],
  entryComponents: [WithdrawPage]
})
export class WithdrawPageModule {}
