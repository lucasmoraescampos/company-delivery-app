import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalShareLinkComponent } from './modal-share-link.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  declarations: [ModalShareLinkComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule,
    CustomScrollModule
  ]
})
export class ModalShareLinkModule { }
