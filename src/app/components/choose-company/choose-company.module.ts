import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseCompanyComponent } from './choose-company.component';
import { IonicModule } from '@ionic/angular';
import { PopoverCompaniesComponent } from './popover-companies/popover-companies.component';

@NgModule({
  declarations: [
    ChooseCompanyComponent,
    PopoverCompaniesComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [ChooseCompanyComponent]
})
export class ChooseCompanyModule { }
