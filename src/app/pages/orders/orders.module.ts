import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrdersPageRoutingModule } from './orders-routing.module';
import { OrdersPage } from './orders.page';
import { ChooseCompanyModule } from 'src/app/components/choose-company/choose-company.module';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';
import { ModalOrderModule } from 'src/app/components/modal-order/modal-order.module';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { FilterModule } from 'src/app/pipes/filter/filter.module';
import { BrMaskerModule } from 'br-mask';
import { FilterDateModule } from 'src/app/pipes/filter-date/filter-date.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule,
    ChooseCompanyModule,
    CustomScrollModule,
    ModalOrderModule,
    MoneyModule,
    FilterModule,
    FilterDateModule,
    BrMaskerModule
  ],
  declarations: [OrdersPage]
})
export class OrdersPageModule {}
