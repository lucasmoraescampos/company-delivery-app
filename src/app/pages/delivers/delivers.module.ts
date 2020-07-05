import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliversPageRoutingModule } from './delivers-routing.module';

import { DeliversPage } from './delivers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliversPageRoutingModule
  ],
  declarations: [DeliversPage]
})
export class DeliversPageModule {}
