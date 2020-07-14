import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddSubcomplementPage } from './add-subcomplement.page';
import { BrMaskerModule } from 'br-mask';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    ReactiveFormsModule,
    NgxLoadingModule
  ],
  declarations: [AddSubcomplementPage],
  entryComponents: [AddSubcomplementPage]
})
export class AddSubcomplementPageModule {}
