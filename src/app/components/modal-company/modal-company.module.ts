import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCompanyComponent } from './modal-company.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChooseImageModule } from 'src/app/components/choose-image/choose-image.module';
import { BrMaskerModule } from 'br-mask';
import { SelectableModule } from 'src/app/components/selectable/selectable.module';
import { NgxLoadingModule } from 'ngx-loading';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  declarations: [ModalCompanyComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ChooseImageModule,
    BrMaskerModule,
    SelectableModule,
    NgxLoadingModule
  ]
})
export class ModalCompanyModule { }
