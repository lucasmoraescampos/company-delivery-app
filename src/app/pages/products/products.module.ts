import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductsPageRoutingModule } from './products-routing.module';
import { ProductsPage } from './products.page';
import { AddSessionPageModule } from '../modal/add-session/add-session.module';
import { AddProductPageModule } from '../modal/add-product/add-product.module';
import { MenuSessionsPageModule } from '../modal/menu-sessions/menu-sessions.module';
import { ProductDetailsPageModule } from '../modal/product-details/product-details.module';
import { SearchProductPageModule } from '../modal/search-product/search-product.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSessionPageModule,
    AddProductPageModule,
    MenuSessionsPageModule,
    ProductDetailsPageModule,
    ProductsPageRoutingModule,
    SearchProductPageModule
  ],
  declarations: [ProductsPage]
})
export class ProductsPageModule {}
