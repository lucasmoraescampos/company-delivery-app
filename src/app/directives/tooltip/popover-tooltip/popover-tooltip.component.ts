import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover-tooltip',
  templateUrl: './popover-tooltip.component.html',
  styleUrls: ['./popover-tooltip.component.scss'],
})
export class PopoverTooltipComponent implements OnInit {

  public tooltip: string;

  constructor() { }

  ngOnInit() {}

}
