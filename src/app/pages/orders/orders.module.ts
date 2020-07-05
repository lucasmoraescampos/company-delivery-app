import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrdersPageRoutingModule } from './orders-routing.module';
import { OrdersPage } from './orders.page';
import { OrderCodeModule } from 'src/app/pipes/order-code/order-code.module';
import { DistanceModule } from 'src/app/pipes/distance/distance.module';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { TimeModule } from 'src/app/pipes/time/time.module';
import { OrderDetailsPageModule } from '../modal/order-details/order-details.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderCodeModule,
    DistanceModule,
    MoneyModule,
    TimeModule,
    OrderDetailsPageModule,
    OrdersPageRoutingModule
  ],
  declarations: [OrdersPage]
})
export class OrdersPageModule {}
