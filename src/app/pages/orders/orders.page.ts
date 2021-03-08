import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalOrderComponent } from '../../components/modal-order/modal-order.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  public async modalOrder() {

    const modal = await this.modalCtrl.create({
      component: ModalOrderComponent,
      backdropDismiss: false
    });

    modal.onWillDismiss()
      .then(res => {
        
        
      });

    return await modal.present();

  }

}
