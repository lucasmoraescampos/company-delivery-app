import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BankAccountPage } from './bank-account.page';
import { BanksPageModule } from '../banks/banks.module';
import { NgxLoadingModule } from 'ngx-loading';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BanksPageModule,
    ReactiveFormsModule,
    NgxLoadingModule,
    BrMaskerModule
  ],
  declarations: [BankAccountPage],
  entryComponents: [BankAccountPage]
})
export class BankAccountPageModule {}
