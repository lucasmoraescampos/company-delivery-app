import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalSearchProductComponent } from './modal-search-product.component';
import { IonicModule } from '@ionic/angular';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [ModalSearchProductComponent],
  imports: [
    CommonModule,
    IonicModule,
    MoneyModule,
    NgxLoadingModule
  ]
})
export class ModalSearchProductModule { }
