import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalOrderMenuComponent } from './modal-order-menu.component';
import { IonicModule } from '@ionic/angular';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { FormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { QuantityModule } from '../quantity/quantity.module';
import { ModalProductDetailsComponent } from './modal-product-details/modal-product-details.component';
import { ModalOrderDetailsComponent } from './modal-order-details/modal-order-details.component';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    MoneyModule,
    NgxLoadingModule,
    QuantityModule,
    CustomScrollModule
  ],
  declarations: [
    ModalOrderMenuComponent,
    ModalProductDetailsComponent,
    ModalOrderDetailsComponent
  ]
})
export class ModalOrderMenuModule { }
