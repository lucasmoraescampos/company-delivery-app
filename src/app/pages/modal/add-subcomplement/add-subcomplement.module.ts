import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSubcomplementPage } from './add-subcomplement.page';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    ReactiveFormsModule
  ],
  declarations: [AddSubcomplementPage],
  entryComponents: [AddSubcomplementPage]
})
export class AddSubcomplementPageModule {}
