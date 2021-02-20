import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SegmentsPageRoutingModule } from './segments-routing.module';
import { SegmentsPage } from './segments.page';
import { ChooseCompanyModule } from 'src/app/components/choose-company/choose-company.module';
import { ModalSegmentModule } from 'src/app/components/modal-segment/modal-segment.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SegmentsPageRoutingModule,
    ChooseCompanyModule,
    ModalSegmentModule
  ],
  declarations: [SegmentsPage]
})
export class SegmentsPageModule {}
