import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalOrderComponent } from './modal-order.component';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { NgxLoadingModule } from 'ngx-loading';
import { ModalCompanyDeliverymenListModule } from '../modal-company-deliverymen-list/modal-company-deliverymen-list.module';

@NgModule({
  declarations: [ModalOrderComponent],
  imports: [
    CommonModule,
    IonicModule,
    MoneyModule,
    NgxLoadingModule,
    ModalCompanyDeliverymenListModule
  ]
})
export class ModalOrderModule { }
