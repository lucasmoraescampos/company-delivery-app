import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductDetailsPage } from './product-details.page';
import { BrMaskerModule } from 'br-mask';
import { AddComplementPageModule } from '../add-complement/add-complement.module';
import { ComplementOptionsPageModule } from '../../popover/complement-options/complement-options.module';
import { AddSubcomplementPageModule } from '../add-subcomplement/add-subcomplement.module';
import { ChangeComplementPageModule } from '../change-complement/change-complement.module';
import { ChangeSubcomplementPageModule } from '../change-subcomplement/change-subcomplement.module';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrMaskerModule,
    IonicModule,
    ReactiveFormsModule,
    AddComplementPageModule,
    ComplementOptionsPageModule,
    AddSubcomplementPageModule,
    ChangeComplementPageModule,
    ChangeSubcomplementPageModule,
    MoneyModule,
    NgxLoadingModule
  ],
  declarations: [ProductDetailsPage],
  entryComponents: [ProductDetailsPage]
})
export class ProductDetailsPageModule {}