import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChooseCompanyModule } from 'src/app/components/choose-company/choose-company.module';
import { ModalOrderMenuModule } from 'src/app/components/modal-order-menu/modal-order-menu.module';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NgxChartsModule,
    ModalOrderMenuModule,
    ChooseCompanyModule,
    CustomScrollModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
