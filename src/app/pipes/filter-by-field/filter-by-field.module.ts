import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterByFieldPipe } from './filter-by-field.pipe';



@NgModule({
  declarations: [FilterByFieldPipe],
  imports: [
    CommonModule
  ],
  exports: [FilterByFieldPipe]
})
export class FilterByFieldModule { }
