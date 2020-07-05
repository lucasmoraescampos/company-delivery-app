import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-product-options',
  templateUrl: './product-options.page.html',
  styleUrls: ['./product-options.page.scss'],
})
export class ProductOptionsPage implements OnInit {

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  public async sessions() {
    this.popoverCtrl.dismiss('sessions');
  }

  public async addSession() {
    this.popoverCtrl.dismiss('add_session');
  }

  public async addProduct() {
    this.popoverCtrl.dismiss('add_product');
  }
}
