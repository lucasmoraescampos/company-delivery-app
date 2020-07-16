import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order/order.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { LocationHelper } from 'src/app/helpers/LocationHelper';
import { OrderDetailsPage } from '../modal/order-details/order-details.page';
import { ModalController, PopoverController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';
import { NumberHelper } from 'src/app/helpers/NumberHelper';
import { OrderOptionsPage } from '../popover/order-options/order-options.page';
import { SearchOrderPage } from '../modal/search-order/search-order.page';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.page.html',
  styleUrls: ['orders.page.scss'],
})
export class OrdersPage implements OnInit {

  public segment: string = 'requests';

  public all_orders: Array<any>;

  public orders: Array<any>;

  private socket: WebSocketSubject<any>;

  constructor(
    private orderSrv: OrderService,
    private loadingSrv: LoadingService,
    private modalCtrl: ModalController,
    private alertSrv: AlertService,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {

    this.prepareOrders();

    this.prepareSocket();

  }

  public async options(ev: any) {

    const popover = await this.popoverCtrl.create({
      component: OrderOptionsPage,
      event: ev,
      translucent: true,
      mode: 'md'
    });

    popover.onWillDismiss()
      .then(res => {

        switch (res.data) {

          case 'search':
            this.search();
            break;

        }

      });

    return await popover.present();

  }

  public refresh(event: any) {

    this.orderSrv.getAll()
      .subscribe(res => {

        event.target.complete();

        if (res.success) {

          this.all_orders = res.data;

          this.filterOrders();

        }

      });
  }

  public accept(order: any) {

    const code = NumberHelper.orderCode(order.id);

    this.alertSrv.confirm(`Aceitar pedido Nº ${code}?`, () => {

      this.loadingSrv.show();

      this.orderSrv.accept(order.id)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            const index = ArrayHelper.getIndexByKey(this.all_orders, 'id', order.id);

            this.all_orders[index] = res.data;

            this.filterOrders();

            console.log({
              user_id: order.user_id,
              order_id: order.id,
              status: 1
            })

            this.socket.next({
              user_id: order.user_id,
              order_id: order.id,
              status: 1
            });

          }

        });

    });

  }

  public refuse(order: any) {

    const code = NumberHelper.orderCode(order.id);

    this.alertSrv.confirm(`Recusar pedido Nº ${code}?`, () => {

      this.loadingSrv.show();

      this.orderSrv.refuse(order.id)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            const index = ArrayHelper.getIndexByKey(this.all_orders, 'id', order.id);

            this.all_orders = ArrayHelper.removeItem(this.all_orders, index);

            this.filterOrders();

            this.socket.next({
              user_id: order.user_id,
              order_id: order.id,
              status: 5
            });

          }

        });

    });

  }

  public release(order: any) {

    const code = NumberHelper.orderCode(order.id);

    this.alertSrv.confirm(`Liberar pedido Nº ${code}?`, () => {

      this.loadingSrv.show();

      this.orderSrv.release(order.id)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            const index = ArrayHelper.getIndexByKey(this.all_orders, 'id', order.id);

            this.all_orders[index] = res.data;

            this.filterOrders();

            this.socket.next({
              user_id: order.user_id,
              order_id: order.id,
              status: 2
            });

          }

        });

    });

  }

  public async details(id: number) {

    const modal = await this.modalCtrl.create({
      component: OrderDetailsPage,
      cssClass: 'modal-custom',
      componentProps: {
        order_id: id
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          const index = ArrayHelper.getIndexByKey(this.all_orders, 'id', id);

          if (res.data == 5) {

            this.all_orders = ArrayHelper.removeItem(this.all_orders, index);

          }

          else {

            this.all_orders[index] = res.data;

          }

          this.filterOrders();

        }

      });

    return await modal.present();

  }

  public changeSegment(value: string) {

    let element = document.getElementById(value);

    element.scrollIntoView({ behavior: "smooth", inline: "center" });

    this.segment = value;

    this.filterOrders();

  }

  public distance(lat: string, lng: string) {

    const company = CompanyService.auth();

    const origin = {
      lat: company.latitude,
      lng: company.longitude
    };

    const destiny = {
      lat: lat,
      lng: lng
    };

    return LocationHelper.distance(origin, destiny);

  }

  public filterOrders() {

    this.loadingSrv.show();

    const orders = [];

    this.orders = null;

    if (this.segment == 'requests') {

      this.all_orders.forEach(order => {
        if (order.status == 0) {
          orders.push(order);
        }
      });

    }

    else if (this.segment == 'running') {

      this.all_orders.forEach(order => {
        if (order.status == 1 || order.status == 2) {
          orders.push(order);
        }
      });

    }

    else if (this.segment == 'delivering') {

      this.all_orders.forEach(order => {
        if (order.status == 3) {
          orders.push(order);
        }
      });

    }

    else if (this.segment == 'completed') {

      this.all_orders.forEach(order => {
        if (order.status == 4) {
          orders.push(order);
        }
      });

    }

    setTimeout(() => {

      this.orders = ArrayHelper.orderbyDesc(orders, 'created_at');

      this.loadingSrv.hide();

    });
    
  }

  private async search() {

    const modal = await this.modalCtrl.create({
      component: SearchOrderPage,
      cssClass: 'modal-custom',
      componentProps: {
        orders: this.all_orders
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          this.all_orders = res.data;

          this.filterOrders();

        }

      });

    return await modal.present();

  }

  private prepareOrders() {

    this.loadingSrv.show();

    this.orderSrv.getAll()
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.all_orders = res.data;

          this.filterOrders();

        }

      });
  }

  private prepareSocket() {

    const company = CompanyService.auth();

    this.socket = webSocket(`${ConfigHelper.Socket}/company/order?id=${company.id}`);

    this.socket.subscribe(order => {

      this.all_orders.unshift(order);

      this.filterOrders()

    });

  }

}
