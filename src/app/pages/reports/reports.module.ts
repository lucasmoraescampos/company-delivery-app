import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReportsPageRoutingModule } from './reports-routing.module';
import { ReportsPage } from './reports.page';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsPageRoutingModule,
    CustomScrollModule
  ],
  declarations: [ReportsPage]
})
export class ReportsPageModule {}
