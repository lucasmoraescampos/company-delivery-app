import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChooseCompanyModule } from 'src/app/components/choose-company/choose-company.module';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { ModalShareLinkModule } from 'src/app/components/modal-share-link/modal-share-link.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NgxChartsModule,
    ChooseCompanyModule,
    CustomScrollModule,
    MoneyModule,
    ModalShareLinkModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
