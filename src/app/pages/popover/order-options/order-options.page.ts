import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-order-options',
  templateUrl: './order-options.page.html',
  styleUrls: ['./order-options.page.scss'],
})
export class OrderOptionsPage implements OnInit {

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  public search() {
    this.popoverCtrl.dismiss('search');
  }
}
