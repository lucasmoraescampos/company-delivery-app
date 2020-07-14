import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchProductPage } from './search-product.page';
import { NgxLoadingModule } from 'ngx-loading';
import { MoneyModule } from 'src/app/pipes/money/money.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxLoadingModule,
    MoneyModule
  ],
  declarations: [SearchProductPage],
  entryComponents: [SearchProductPage]
})
export class SearchProductPageModule {}
