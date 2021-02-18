import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TablePageRoutingModule } from './table-routing.module';
import { TablePage } from './table.page';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TablePageRoutingModule,
    MoneyModule,
    CustomScrollModule
  ],
  declarations: [TablePage]
})
export class TablePageModule {}
