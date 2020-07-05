import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeSubcomplementPage } from './change-subcomplement.page';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    ReactiveFormsModule
  ],
  declarations: [ChangeSubcomplementPage],
  entryComponents: [ChangeSubcomplementPage]
})
export class ChangeSubcomplementPageModule {}
