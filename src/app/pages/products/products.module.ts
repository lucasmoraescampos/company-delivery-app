import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductsPageRoutingModule } from './products-routing.module';
import { ProductsPage } from './products.page';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { ChooseCompanyModule } from 'src/app/components/choose-company/choose-company.module';
import { ModalProductComponent } from './modal-product/modal-product.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ChooseImageModule } from 'src/app/components/choose-image/choose-image.module';
import { BrMaskerModule } from 'br-mask';
import { ModalComplementComponent } from './modal-complement/modal-complement.component';
import { ModalComplementsComponent } from './modal-complements/modal-complements.component';
import { ModalSearchProductComponent } from './modal-search-product/modal-search-product.component';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

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
    CustomScrollModule
  ],
  declarations: [
    ProductsPage,
    ModalProductComponent,
    ModalComplementsComponent,
    ModalComplementComponent,
    ModalSearchProductComponent
  ]
})
export class ProductsPageModule {}
