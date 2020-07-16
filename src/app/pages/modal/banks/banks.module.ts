import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BanksPage } from './banks.page';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxLoadingModule
  ],
  declarations: [BanksPage],
  entryComponents: [BanksPage]
})
export class BanksPageModule {}
