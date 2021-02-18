import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-modal-product-details',
  templateUrl: './modal-product-details.component.html',
  styleUrls: ['./modal-product-details.component.scss'],
})
export class ModalProductDetailsComponent implements OnInit {

  public index: number;

  public product: any;

  public note: string = null;

  public qty: number = 1;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private orderSrv: OrderService
  ) { }

  ngOnInit() {

    this.index = this.navParams.get('index');

    this.product = this.navParams.get('product');

    if (this.index !== undefined) {

      this.note = this.product.note;

      this.qty = this.product.qty;

    }

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public changeQty(ev: any) {
    this.qty = ev.qty;
  }

  public add() {
    this.orderSrv.addProductCurrentOrder({
      id: this.product.id,
      name: this.product.name,
      description: this.product.description,
      price: this.product.price - this.product.rebate,
      qty: this.qty,
      note: this.note,
      image: this.product.image
    });

    this.modalCtrl.dismiss();
  }

  public update() {

    this.orderSrv.updateProductCurrentOrder(this.index, {
      id: this.product.id,
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      qty: this.qty,
      note: this.note,
      image: this.product.image
    });

    this.modalCtrl.dismiss();
  }

}
