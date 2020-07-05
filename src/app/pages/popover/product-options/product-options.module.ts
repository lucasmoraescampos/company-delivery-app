import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductOptionsPage } from './product-options.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [ProductOptionsPage],
  entryComponents: [ProductOptionsPage]
})
export class ProductOptionsPageModule {}
