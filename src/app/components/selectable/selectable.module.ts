import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxLoadingModule } from 'ngx-loading';
import { SelectableComponent } from './selectable.component';
import { ModalSelectableComponent } from './modal-selectable/modal-selectable.component';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  declarations: [SelectableComponent, ModalSelectableComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxLoadingModule,
    CustomScrollModule
  ],
  entryComponents: [ModalSelectableComponent],
  exports: [SelectableComponent]
})
export class SelectableModule { }
