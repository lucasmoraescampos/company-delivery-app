import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleAutocompleteComponent } from './google-autocomplete.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [GoogleAutocompleteComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [GoogleAutocompleteComponent]
})
export class GoogleAutocompleteModule { }
