import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DeliveryPersonsPageRoutingModule } from './delivery-persons-routing.module';
import { DeliveryPersonsPage } from './delivery-persons.page';
import { ChooseCompanyModule } from 'src/app/components/choose-company/choose-company.module';
import { ModalDeliveryPersonComponent } from './modal-delivery-person/modal-delivery-person.component';
import { ModalSearchDeliveryPersonComponent } from './modal-search-delivery-person/modal-search-delivery-person.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ChooseImageModule } from 'src/app/components/choose-image/choose-image.module';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveryPersonsPageRoutingModule,
    ChooseCompanyModule,
    NgxLoadingModule,
    ReactiveFormsModule,
    ChooseImageModule,
    CustomScrollModule
  ],
  declarations: [
    DeliveryPersonsPage,
    ModalDeliveryPersonComponent,
    ModalSearchDeliveryPersonComponent
  ]
})
export class DeliveryPersonsPageModule {}
