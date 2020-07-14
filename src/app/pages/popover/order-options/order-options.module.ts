import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrderOptionsPage } from './order-options.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [OrderOptionsPage],
  entryComponents: [OrderOptionsPage]
})
export class OrderOptionsPageModule {}
