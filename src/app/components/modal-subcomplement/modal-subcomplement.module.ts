import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalSubcomplementComponent } from './modal-subcomplement.component';
import { IonicModule } from '@ionic/angular';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  declarations: [ModalSubcomplementComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    BrMaskerModule,
    CustomScrollModule,
    NgxLoadingModule
  ]
})
export class ModalSubcomplementModule { }
