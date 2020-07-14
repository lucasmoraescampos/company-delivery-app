import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChangeComplementPage } from './change-complement.page';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NgxLoadingModule
  ],
  declarations: [ChangeComplementPage],
  entryComponents: [ChangeComplementPage]
})
export class ChangeComplementPageModule {}
