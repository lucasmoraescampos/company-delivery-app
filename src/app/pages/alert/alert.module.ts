import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertSuccessPage } from './alert-success/alert-success.page';
import { AlertErrorPage } from './alert-error/alert-error.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlertLocationPage } from './alert-location/alert-location.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [
    AlertSuccessPage,
    AlertErrorPage,
    AlertLocationPage
  ],
  entryComponents: [
    AlertSuccessPage,
    AlertErrorPage,
    AlertLocationPage
  ]
})
export class AlertModule { }
