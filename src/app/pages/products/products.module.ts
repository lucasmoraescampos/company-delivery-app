import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductsPageRoutingModule } from './products-routing.module';
import { ProductsPage } from './products.page';
import { AddSessionPageModule } from '../modal/add-session/add-session.module';
import { AddProductPageModule } from '../modal/add-product/add-product.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSessionPageModule,
    AddProductPageModule,
    ProductsPageRoutingModule
  ],
  declarations: [ProductsPage]
})
export class ProductsPageModule {}
