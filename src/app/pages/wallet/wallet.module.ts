import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WalletPageRoutingModule } from './wallet-routing.module';
import { WalletPage } from './wallet.page';
import { WithdrawPageModule } from '../modal/withdraw/withdraw.module';
import { MoneyModule } from 'src/app/pipes/money/money.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletPageRoutingModule,
    WithdrawPageModule,
    MoneyModule
  ],
  declarations: [WalletPage]
})
export class WalletPageModule {}
