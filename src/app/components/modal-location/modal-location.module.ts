import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalLocationComponent } from './modal-location.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleAutocompleteModule } from '../google-autocomplete/google-autocomplete.module';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [ModalLocationComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleAutocompleteModule,
    NgxLoadingModule
  ]
})
export class ModalLocationModule { }
