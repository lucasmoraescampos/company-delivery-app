import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchOrderPage } from './search-order.page';
import { OrderDetailsPageModule } from '../order-details/order-details.module';
import { TimeModule } from 'src/app/pipes/time/time.module';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { DistanceModule } from 'src/app/pipes/distance/distance.module';
import { OrderCodeModule } from 'src/app/pipes/order-code/order-code.module';
import { NgxLoadingModule } from 'ngx-loading';

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
    NgxLoadingModule
  ],
  declarations: [SearchOrderPage],
  entryComponents: [SearchOrderPage]
})
export class SearchOrderPageModule {}
