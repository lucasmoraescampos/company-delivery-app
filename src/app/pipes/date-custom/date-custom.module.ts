import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateCustomPipe } from './date-custom.pipe';



@NgModule({
  declarations: [DateCustomPipe],
  imports: [
    CommonModule
  ],
  exports: [DateCustomPipe]
})
export class DateCustomModule { }
