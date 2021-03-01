import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalProductComponent } from './modal-product.component';
import { ChooseImageModule } from 'src/app/components/choose-image/choose-image.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrMaskerModule } from 'br-mask';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [ModalProductComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    BrMaskerModule,
    ChooseImageModule,
    NgxLoadingModule
  ]
})
export class ModalProductModule { }
