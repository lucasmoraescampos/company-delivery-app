import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComplementComponent } from './modal-complement.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrMaskerModule } from 'br-mask';
import { NgxLoadingModule } from 'ngx-loading';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  declarations: [ModalComplementComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    BrMaskerModule,
    NgxLoadingModule,
    CustomScrollModule
  ]
})
export class ModalComplementModule { }
