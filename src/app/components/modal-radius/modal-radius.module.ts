import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalRadiusComponent } from './modal-radius.component';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule } from '@angular/forms';
import { ReplaceModule } from 'src/app/pipes/replace/replace.module';

@NgModule({
  declarations: [ModalRadiusComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReplaceModule,
    NgxLoadingModule
  ]
})
export class ModalRadiusModule { }
