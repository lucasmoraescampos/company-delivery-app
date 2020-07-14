import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order/order.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ModalController, NavParams } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { NumberHelper } from 'src/app/helpers/NumberHelper';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';
import { OrderDetailsPage } from '../order-details/order-details.page';
import { CompanyService } from 'src/app/services/company/company.service';
import { LocationHelper } from 'src/app/helpers/LocationHelper';

@Component({
  selector: 'app-search-order',
  templateUrl: './search-order.page.html',
  styleUrls: ['./search-order.page.scss'],
})
export class SearchOrderPage implements OnInit {

  public loading: boolean = false;

  public search: string;

  public orders: Array<any>;

  public results: Array<any>;

  constructor(
    private orderSrv: OrderService,
    private loadingSrv: LoadingService,
    private modalCtrl: ModalController,
    private alertSrv: AlertService,
    private navParams: NavParams
  ) { }

  ngOnInit() {

    this.orders = this.navParams.get('orders');

  }

  public dismiss() {
    this.modalCtrl.dismiss(this.orders);
  }

  public doSearch() {

    if (this.search && this.search.length > 0) {

      this.loading = true;

      const search = this.normalize(this.search);

      this.results = [];

      this.orders.forEach(order => {

        const code = NumberHelper.orderCode(order.id);

        const name = this.normalize(`${order.user_name} ${order.user_surname}`);

        if (name.match(new RegExp(search, 'gi')) || code.match(new RegExp(search, 'gi'))) {

          this.results.push(order);

        }

      });

      this.results = ArrayHelper.orderbyAsc(this.results, 'id');

      this.loading = false;

    }

  }

  public accept(order: any) {

    const code = NumberHelper.orderCode(order.id);

    this.alertSrv.confirm(`Aceitar pedido Nº ${code}?`, () => {

      this.loadingSrv.show();

      this.orderSrv.accept(order.id)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            let index = ArrayHelper.getIndexByKey(this.orders, 'id', order.id);

            this.orders[index] = res.data;

            index = ArrayHelper.getIndexByKey(this.orders, 'id', order.id);

            this.orders[index] = res.data;

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

            let index = ArrayHelper.getIndexByKey(this.orders, 'id', order.id);

            this.orders = ArrayHelper.removeItem(this.orders, index);

            index = ArrayHelper.getIndexByKey(this.orders, 'id', order.id);

            this.orders[index] = res.data;

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

            let index = ArrayHelper.getIndexByKey(this.orders, 'id', order.id);

            this.orders[index] = res.data;

            index = ArrayHelper.getIndexByKey(this.orders, 'id', order.id);

            this.orders[index] = res.data;

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

          let index = ArrayHelper.getIndexByKey(this.orders, 'id', id);

          if (res.data == 5) {

            this.orders = ArrayHelper.removeItem(this.orders, index);

            index = ArrayHelper.getIndexByKey(this.orders, 'id', id);

            this.orders = ArrayHelper.removeItem(this.orders, index);

          }

          else {

            this.orders[index] = res.data;

            index = ArrayHelper.getIndexByKey(this.orders, 'id', id);

            this.orders[index] = res.data;

          }

        }

      });

    return await modal.present();

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

  private normalize(str: string) {
    const map = {
      'a': 'á|à|ã|â|À|Á|Ã|Â',
      'e': 'é|è|ê|É|È|Ê',
      'i': 'í|ì|î|Í|Ì|Î',
      'o': 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
      'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
      'c': 'ç|Ç',
      'n': 'ñ|Ñ'
    };

    str = str.toLowerCase();

    for (let pattern in map) {
      str = str.replace(new RegExp(map[pattern], 'g'), pattern);
    };

    return str;
  }

}
