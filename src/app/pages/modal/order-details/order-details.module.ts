import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrderDetailsPage } from './order-details.page';
import { NgxLoadingModule } from 'ngx-loading';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { OrderCodeModule } from 'src/app/pipes/order-code/order-code.module';
import { OrderStatusModule } from 'src/app/pipes/order-status/order-status.module';
import { PaymentMethodModule } from 'src/app/pipes/payment-method/payment-method.module';
import { PaymentMethodIconModule } from 'src/app/pipes/payment-method-icon/payment-method-icon.module';
import { ChatPageModule } from '../chat/chat.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoneyModule,
    OrderCodeModule,
    OrderStatusModule,
    PaymentMethodModule,
    PaymentMethodIconModule,
    ChatPageModule,
    NgxLoadingModule
  ],
  declarations: [OrderDetailsPage],
  entryComponents: [OrderDetailsPage]
})
export class OrderDetailsPageModule { }
