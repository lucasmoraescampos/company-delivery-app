import { Directive, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverTooltipComponent } from './popover-tooltip/popover-tooltip.component';

@Directive({
  selector: '[tooltip]',
  host: {
    '(click)': 'presentPopover($event)'
  }
})
export class TooltipDirective {

  @Input('tooltip') tooltip: string;

  constructor(private popoverCtrl: PopoverController) {}

  async presentPopover(ev: any) {

    const popover = await this.popoverCtrl.create({
      component: PopoverTooltipComponent,
      event: ev,
      mode: 'ios',
      translucent: true,
      componentProps: {
        tooltip: this.tooltip
      }
    });

    return await popover.present();

  }

}
