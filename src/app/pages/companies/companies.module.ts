import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CompaniesPageRoutingModule } from './companies-routing.module';
import { CompaniesPage } from './companies.page';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';
import { ModalCompanyModule } from 'src/app/components/modal-company/modal-company.module';
import { ModalPaymentMethodsModule } from 'src/app/components/modal-payment-methods/modal-payment-methods.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CompaniesPageRoutingModule,
    CustomScrollModule,
    ModalCompanyModule,
    ModalPaymentMethodsModule
  ],
  declarations: [CompaniesPage]
})
export class CompaniesPageModule {}
