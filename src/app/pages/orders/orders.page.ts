import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { LoadingService } from 'src/app/services/loading.service';
import { OrderService } from 'src/app/services/order.service';
import { ModalOrderComponent } from '../../components/modal-order/modal-order.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit, OnDestroy {

  @ViewChild(IonSlides) slides: IonSlides;

  public slideActiveIndex: number = 0;

  public segment: number = 0;

  public orders: any[];

  public search: string;

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private orderSrv: OrderService,
    private loadingSrv: LoadingService
  ) { }

  ngOnInit() {

    this.initOrders();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ionViewDidEnter() {
    this.slides.update();
  }

  public segmentChanged() {
    this.slideActiveIndex = this.segment;
    this.slides.slideTo(this.segment);
  }

  public async modalOrder(order: any) {

    const modal = await this.modalCtrl.create({
      component: ModalOrderComponent,
      backdropDismiss: false,
      componentProps: {
        order: order
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data) {

          const index = ArrayHelper.getIndexByKey(this.orders, 'id', order.id);

          this.orders[index] = res.data;

        }

      });

    return await modal.present();

  }

  private initOrders() {
    this.loadingSrv.show();
    this.orderSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loadingSrv.hide();
        this.orders = res.data;
      });
  }

}
