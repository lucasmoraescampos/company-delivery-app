import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CategoriesPageRoutingModule } from './categories-routing.module';
import { CategoriesPage } from './categories.page';
import { ChooseCompanyModule } from 'src/app/components/choose-company/choose-company.module';
import { ModalCategoryComponent } from './modal-category/modal-category.component';
import { NgxLoadingModule } from 'ngx-loading';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesPageRoutingModule,
    ChooseCompanyModule,
    NgxLoadingModule,
    CustomScrollModule
  ],
  declarations: [CategoriesPage, ModalCategoryComponent]
})
export class CategoriesPageModule {}
