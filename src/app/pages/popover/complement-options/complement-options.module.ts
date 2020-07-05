import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComplementOptionsPage } from './complement-options.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [ComplementOptionsPage],
  entryComponents: [ComplementOptionsPage]
})
export class ComplementOptionsPageModule {}
