import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StringHelper } from 'src/app/helpers/string.helper';
import { AlertService } from 'src/app/services/alert.service';
import { AttendantService } from 'src/app/services/attendant.service';
import { SegmentService } from 'src/app/services/segment.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { TableService } from 'src/app/services/table.service';
import { ModalOrderDetailsComponent } from './modal-order-details/modal-order-details.component';
import { ModalProductDetailsComponent } from './modal-product-details/modal-product-details.component';

@Component({
  selector: 'app-modal-order-menu',
  templateUrl: './modal-order-menu.component.html',
  styleUrls: ['./modal-order-menu.component.scss'],
})
export class ModalOrderMenuComponent implements OnInit, OnDestroy {

  public loading: boolean;

  public products: any[];

  public categories: any[];

  public results: any[];

  public attendants: any[];

  public tables: any[];

  public order: any;

  public segment: number;

  public search: string;

  public total: number;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private segmentSrv: SegmentService,
    private productSrv: ProductService,
    private alertSrv: AlertService,
    private orderSrv: OrderService,
    private attendantSrv: AttendantService,
    private tableSrv: TableService
  ) { }

  ngOnInit() {

    this.prepareCategories();

    this.prepareOrder();

    this.prepareAttendants();

    this.prepareTables();
    
  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  public dismiss() {
    if (this.order.products.length > 0) {
      this.alertSrv.show({
        icon: 'warning',
        message: 'Se sair agora todos os produtos selecionados serão esquecidos. Deseja sair?',
        confirmButtonText: 'Sair',
        onConfirm: () => {
          this.orderSrv.removeAllProductsCurrentOrder();
          this.modalCtrl.dismiss();
        }
      });
    }
    else {
      this.modalCtrl.dismiss();
    }
  }

  public searchChanged() {
    this.searchProducts();
  }

  public segmentChanged() {
    this.searchProducts();
  }

  public async modalProduct(product: any) {
    
    const modal = await this.modalCtrl.create({
      component: ModalProductDetailsComponent,
      backdropDismiss: false,
      componentProps: {
        product: product
      }
    });

    return await modal.present();

  }

  public async modalDetails() {

    const current = await this.modalCtrl.getTop();

    const modal = await this.modalCtrl.create({
      component: ModalOrderDetailsComponent,
      backdropDismiss: false,
      cssClass: 'modal-lg',
      componentProps: {
        attendants: this.attendants,
        tables: this.tables
      }
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          current.dismiss();
        }
      });
    
    return await modal.present();
  }

  private searchProducts() {
    const search = StringHelper.normalize(this.search);
    this.results = [];
    if (search.length > 0) {
      this.products.forEach(product => {
        let name = StringHelper.normalize(product.name);
        if (name.match(new RegExp(search, 'gi')) && product.category_id == this.segment) {
          this.results.push(product);
        }
      });
    }
    else {

      this.products.forEach(product => {
        if (product.category_id == this.segment) {
          this.results.push(product);
        }
      });
    }
  }

  private prepareCategories() {
    this.loading = true;
    this.segmentSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        if (res.success) {
          this.categories = res.data;
          this.prepareProducts();
        }
      });
  }

  private prepareProducts() {
    this.loading = true;
    this.productSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        if (res.success) {
          this.products = res.data;
          if (this.categories.length > 0) {
            this.segment = this.categories[0].id;
            this.search = '';
            this.searchProducts();
          }
        }
      });
  }

  private prepareAttendants() {
    this.loading = true;
    this.attendantSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        if (res.success) {
          this.attendants = res.data;
        }
      });
  }

  private prepareTables() {
    this.loading = true;
    this.tableSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        if (res.success) {
          this.tables = res.data;
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
