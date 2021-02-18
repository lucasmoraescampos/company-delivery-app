import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AttendantsPageRoutingModule } from './attendants-routing.module';
import { AttendantsPage } from './attendants.page';
import { ChooseCompanyModule } from 'src/app/components/choose-company/choose-company.module';
import { ModalAttendantComponent } from './modal-attendant/modal-attendant.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ChooseImageModule } from 'src/app/components/choose-image/choose-image.module';
import { ModalSearchAttendantComponent } from './modal-search-attendant/modal-search-attendant.component';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendantsPageRoutingModule,
    ChooseCompanyModule,
    NgxLoadingModule,
    ChooseImageModule,
    ReactiveFormsModule,
    CustomScrollModule
  ],
  declarations: [
    AttendantsPage,
    ModalAttendantComponent,
    ModalSearchAttendantComponent
  ]
})
export class AttendantsPageModule {}
