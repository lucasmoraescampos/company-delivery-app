import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonSlides, ModalController, NavParams } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { ModalProductDetailsComponent } from '../modal-product-details/modal-product-details.component';

@Component({
  selector: 'app-modal-order-details',
  templateUrl: './modal-order-details.component.html',
  styleUrls: ['./modal-order-details.component.scss'],
})
export class ModalOrderDetailsComponent implements OnInit, OnDestroy {

  @ViewChild(IonSlides) slides: IonSlides;

  public loading: boolean;

  public slideIndex: number = 0;

  public submitAttempt: boolean;

  public attendants: any[];

  public tables: any[];

  public order: any;

  public total: number;

  public type: number = 0;

  public payment_type: number;

  public attendant_id: number;

  public table_id: number;

  public address: string;

  public additional_information: string;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private orderSrv: OrderService,
    private actionSheetCtrl: ActionSheetController,
    private navParams: NavParams,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.prepareOrder();
    
    this.attendants = this.navParams.get('attendants');

    this.tables = this.navParams.get('tables');

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  ionViewDidEnter() {
    this.slides.update();
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public async options(index: number) {

    const product = this.order.products[index];

    const actionSheet = await this.actionSheetCtrl.create({
      header: product.name,
      buttons: [{
        text: 'Editar',
        handler: () => {
          this.modalProduct(index);
        }
      }, {
        text: 'Excluir',
        handler: () => {
          this.removeProduct(index);
        }
      }, {
        text: 'Cancelar',
        role: 'cancel'
      }]
    });

    await actionSheet.present();

  }

  public prev() {
    this.slides.slidePrev();
    this.slideIndex--;
  }

  public next() {
    this.slides.slideNext();
    this.slideIndex++;
  }

  public save() {

    this.submitAttempt = true;

    if (this.type == 0 || (this.address?.length > 0 && this.payment_type !== undefined)) {

      this.loading = true;

      this.order.type = this.type;

      this.order.attendant_id = this.attendant_id;

      this.order.table_id = this.attendant_id;

      this.order.additional_information = this.additional_information;

      this.order.address = this.address;

      this.order.payment_type = this.payment_type;

      this.orderSrv.create(this.order)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(res => {

          this.loading = false;

          if (res.success) {

            this.alertSrv.toast({
              icon: 'success',
              message: res.message
            });

            this.orderSrv.removeAllProductsCurrentOrder();

            this.modalCtrl.dismiss(true);

          }

        });

    }

  }

  private async modalProduct(index: number) {

    const product = this.order.products[index];
    
    const modal = await this.modalCtrl.create({
      component: ModalProductDetailsComponent,
      backdropDismiss: false,
      componentProps: {
        index: index,
        product: product
      }
    });

    return await modal.present();

  }

  private removeProduct(index: number) {

    const product = this.order.products[index];

    this.alertSrv.show({
      icon: 'question',
      message: `Excluir ${product.name} deste pedido?`,
      confirmButtonText: 'Excluir',
      onConfirm: () => {
        this.orderSrv.removeProductCurrentOrder(index);
      }
    });

  }

  private prepareOrder() {
    this.orderSrv.currentOrder
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(order => {
        this.order = order;
        this.total = 0;
        this.order.products.forEach((product: any) => {
          this.total += (product.price * product.qty)
        });
      });
  }
}
