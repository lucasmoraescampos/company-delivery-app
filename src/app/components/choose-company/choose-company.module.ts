import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseCompanyComponent } from './choose-company.component';
import { IonicModule } from '@ionic/angular';
import { PopoverCompaniesComponent } from './popover-companies/popover-companies.component';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  declarations: [
    ChooseCompanyComponent,
    PopoverCompaniesComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    CustomScrollModule
  ],
  exports: [ChooseCompanyComponent]
})
export class ChooseCompanyModule { }
