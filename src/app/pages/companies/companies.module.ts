import { ModalFirstAccessComponent } from './modal-first-access/modal-first-access.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompaniesPageRoutingModule } from './companies-routing.module';
import { CompaniesPage } from './companies.page';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { BrMaskerModule } from 'br-mask';
import { NgxLoadingModule } from 'ngx-loading';
import { ModalCompanyComponent } from './modal-company/modal-company.component';
import { SelectableModule } from 'src/app/components/selectable/selectable.module';
import { ModalPaymentMethodsComponent } from './modal-payment-methods/modal-payment-methods.component';
import { ChooseImageModule } from 'src/app/components/choose-image/choose-image.module';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompaniesPageRoutingModule,
    MoneyModule,
    BrMaskerModule,
    ReactiveFormsModule,
    NgxLoadingModule,
    SelectableModule,
    ChooseImageModule,
    CustomScrollModule
  ],
  declarations: [
    CompaniesPage,
    ModalFirstAccessComponent,
    ModalCompanyComponent,
    ModalPaymentMethodsComponent
  ]
})
export class CompaniesPageModule {}
