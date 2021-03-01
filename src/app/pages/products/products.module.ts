import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductsPageRoutingModule } from './products-routing.module';
import { ProductsPage } from './products.page';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { ChooseCompanyModule } from 'src/app/components/choose-company/choose-company.module';
import { NgxLoadingModule } from 'ngx-loading';
import { ChooseImageModule } from 'src/app/components/choose-image/choose-image.module';
import { BrMaskerModule } from 'br-mask';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';
import { ModalProductModule } from '../../components/modal-product/modal-product.module';
import { ModalSearchProductModule } from 'src/app/components/modal-search-product/modal-search-product.module';
import { ModalComplementsModule } from '../../components/modal-complements/modal-complements.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    MoneyModule,
    ChooseCompanyModule,
    ReactiveFormsModule,
    NgxLoadingModule,
    ChooseImageModule,
    BrMaskerModule,
    CustomScrollModule,
    ModalProductModule,
    ModalSearchProductModule,
    ModalComplementsModule
  ],
  declarations: [ProductsPage]
})
export class ProductsPageModule {}
