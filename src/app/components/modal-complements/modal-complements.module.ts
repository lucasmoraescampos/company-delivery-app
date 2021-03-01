import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalComplementModule } from '../modal-complement/modal-complement.module';
import { ModalComplementsComponent } from './modal-complements.component';
import { ModalSubcomplementModule } from '../modal-subcomplement/modal-subcomplement.module';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [ModalComplementsComponent],
  imports: [
    CommonModule,
    IonicModule,
    ModalComplementModule,
    ModalSubcomplementModule,
    NgxLoadingModule
  ]
})
export class ModalComplementsModule { }
