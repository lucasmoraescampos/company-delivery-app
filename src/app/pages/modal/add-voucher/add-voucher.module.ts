import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddVoucherPage } from './add-voucher.page';
import { BrMaskerModule } from 'br-mask';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    BrMaskerModule,
    NgxLoadingModule
  ],
  declarations: [AddVoucherPage],
  entryComponents: [AddVoucherPage]
})
export class AddVoucherPageModule {}
