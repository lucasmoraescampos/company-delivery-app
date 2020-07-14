import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PausedPage } from './paused.page';
import { NgxLoadingModule } from 'ngx-loading';
import { MoneyModule } from 'src/app/pipes/money/money.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxLoadingModule,
    MoneyModule
  ],
  declarations: [PausedPage],
  entryComponents: [PausedPage]
})
export class PausedPageModule {}
