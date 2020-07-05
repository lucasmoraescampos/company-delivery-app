import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order/order.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { LocationHelper } from 'src/app/helpers/LocationHelper';
import { OrderDetailsPage } from '../modal/order-details/order-details.page';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';
import { NumberHelper } from 'src/app/helpers/NumberHelper';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.page.html',
  styleUrls: ['orders.page.scss'],
})
export class OrdersPage implements OnInit{

  public segment: string = 'requests';

  public requests: Array<any>;

  public running: Array<any>;

  public delivering: Array<any>;

  public completed: Array<any>;

  constructor(
    private orderSrv: OrderService,
    private loadingSrv: LoadingService,
    private modalCtrl: ModalController,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.prepareOrders();

  }
  
  public refresh(event: any) {

    this.orderSrv.getAll()
      .subscribe(res => {

        event.target.complete();

        if (res.success) {

          this.requests = res.data[0] ? res.data[0] : [];

          const running = res.data[1] ? res.data[1] : [];

          res.data[2].forEach((order: any) => running.push(order));

          this.running = ArrayHelper.orderbyDesc(running, 'created_at');

          this.delivering = res.data[3] ? res.data[3] : [];

          this.completed = res.data[4] ? res.data[4] : [];

        }

      });
  }

  public accept(index: number) {

    const id = this.requests[index].id;

    const code = NumberHelper.orderCode(id);

    this.alertSrv.confirm(`Aceitar pedido Nº ${code}?`, () => {

      this.loadingSrv.show();

      this.orderSrv.accept(id)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            this.requests[index].status = 1;

            this.running.unshift(this.requests[index]);

            this.requests = ArrayHelper.removeItem(this.requests, index);

          }

        });

    });

  }

  public refuse(index: number) {

    const id = this.requests[index].id;

    const code = NumberHelper.orderCode(id);

    this.alertSrv.confirm(`Recusar pedido Nº ${code}?`, () => {

      this.loadingSrv.show();

      this.orderSrv.refuse(id)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            this.requests = ArrayHelper.removeItem(this.requests, index);

          }

        });

    });

  }

  public release(index: number) {

    const id = this.running[index].id;

    const code = NumberHelper.orderCode(id);

    this.alertSrv.confirm(`Liberar pedido Nº ${code}?`, () => {

      this.loadingSrv.show();

      this.orderSrv.release(id)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            this.running[index].status = 2;

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
        
        if (this.segment == 'requests') {

          if (res.data.status == 1) {

            const index = ArrayHelper.getIndexByKey(this.requests, 'id', id);

            this.requests[index].status = 1;

            this.running.unshift(this.requests[index]);

            this.requests = ArrayHelper.removeItem(this.requests, index);

          }

          else if (res.data.status == 4) {

            const index = ArrayHelper.getIndexByKey(this.requests, 'id', id);

            this.requests = ArrayHelper.removeItem(this.requests, index);

          }

        }

        else if (this.segment == 'running') {

          if (res.data.status == 2) {

            const index = ArrayHelper.getIndexByKey(this.running, 'id', id);

            this.running[index].status = 2;

          }

          else if (res.data.status == 4) {

            const index = ArrayHelper.getIndexByKey(this.running, 'id', id);

            this.running[index].status = 4;

            this.completed.unshift(this.running[index]);

            this.running = ArrayHelper.removeItem(this.running, index);

          }

        }

        else if (this.segment == 'delivering') {

          if (res.data.status == 4) {

            const index = ArrayHelper.getIndexByKey(this.delivering, 'id', id);

            this.delivering[index].status = 4;

            this.completed.unshift(this.delivering[index]);

            this.delivering = ArrayHelper.removeItem(this.delivering, index);

          }

        }

      });

    return await modal.present();

  }

  public changeSegment(value: string) {

    let element = document.getElementById(value);

    element.scrollIntoView({ behavior: "smooth", inline: "center" });

    this.segment = value;

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

  private prepareOrders() {

    this.loadingSrv.show();

    this.orderSrv.getAll()
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.requests = res.data[0] ? res.data[0] : [];

          const running = res.data[1] ? res.data[1] : [];

          res.data[2].forEach((order: any) => running.push(order));

          this.running = ArrayHelper.orderbyDesc(running, 'created_at');

          this.delivering = res.data[3] ? res.data[3] : [];

          this.completed = res.data[4] ? res.data[4] : [];

        }

      });
  }

}
