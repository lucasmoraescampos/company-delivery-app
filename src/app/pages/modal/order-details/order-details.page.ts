import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { OrderService } from 'src/app/services/order/order.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ChatPage } from '../chat/chat.page';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  public loading: boolean = false;

  public order: any;

  constructor(
    private modalCtrl: ModalController,
    private orderSrv: OrderService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertSrv: AlertService,
    private loadingSrv: LoadingService
  ) { }

  ngOnInit() {

    this.prepareOrder();

  }

  public dismiss() {
    this.modalCtrl.dismiss(this.order);
  }

  public accept() {

    this.alertSrv.confirm(`Aceitar pedido?`, () => {

      this.loadingSrv.show();

      this.orderSrv.accept(this.order.id)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            this.order.status = 1;

          }

        });

    });

  }

  public refuse() {

    this.alertSrv.confirm(`Recusar pedido?`, () => {

      this.loadingSrv.show();

      this.orderSrv.refuse(this.order.id)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            this.order.status = 4;

            this.dismiss();

          }

        });

    });

  }

  public release() {

    this.alertSrv.confirm(`Liberar pedido?`, () => {

      this.loadingSrv.show();

      this.orderSrv.release(this.order.id)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            this.order.status = 2;

          }

        });

    });

  }

  public finalize() {

    this.alertSrv.confirm(`Finalizar pedido?`, () => {

      this.loadingSrv.show();

      this.orderSrv.complete(this.order.id)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            this.order.status = 4;

            this.order.delivered_at = new Date();

          }

        });

    });

  }

  public company(id: number) {

    this.modalCtrl.dismiss();

    this.navCtrl.navigateForward('/products', {
      queryParams: {
        company: id
      }
    });

  }

  public total(a: number, b: number) {
    return Number(a) * Number(b);
  }

  public async chat() {

    const modal = await this.modalCtrl.create({
      component: ChatPage,
      cssClass: 'modal-custom',
      componentProps: {
        user: {
          id: this.order.user_id,
          user: this.order.user_name
        }
      }
    });

    return await modal.present();

  }

  private prepareOrder() {

    this.loading = true;

    const id = this.navParams.get('order_id');

    this.orderSrv.getById(id)
      .subscribe(res => {

        this.loading = false;

        if (res.success) {

          this.order = res.data;

        }

      });

  }
}
