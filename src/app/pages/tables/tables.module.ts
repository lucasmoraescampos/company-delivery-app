import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TablesPageRoutingModule } from './tables-routing.module';
import { TablesPage } from './tables.page';
import { ChooseCompanyModule } from 'src/app/components/choose-company/choose-company.module';
import { ModalTableComponent } from './modal-table/modal-table.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxLoadingModule } from 'ngx-loading';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TablesPageRoutingModule,
    ChooseCompanyModule,
    QRCodeModule,
    NgxLoadingModule,
    CustomScrollModule
  ],
  declarations: [
    TablesPage,
    ModalTableComponent
  ]
})
export class TablesPageModule {}
