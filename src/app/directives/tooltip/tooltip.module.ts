import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from './tooltip.directive';
import { PopoverTooltipComponent } from './popover-tooltip/popover-tooltip.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [TooltipDirective, PopoverTooltipComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [TooltipDirective]
})
export class TooltipModule { }
