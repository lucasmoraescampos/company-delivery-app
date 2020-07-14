import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, ModalController, IonSegment } from '@ionic/angular';
import { LoadingService } from '../../services/loading/loading.service';
import { ProductOptionsPage } from '../popover/product-options/product-options.page';
import { ProductService } from '../../services/product/product.service';
import { ProductDetailsPage } from '../modal/product-details/product-details.page';
import { MenuSessionsPage } from '../modal/menu-sessions/menu-sessions.page';
import { AddSessionPage } from '../modal/add-session/add-session.page';
import { AddProductPage } from '../modal/add-product/add-product.page';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';
import { MenuSessionService } from 'src/app/services/menu-session/menu-session.service';
import { SearchProductPage } from '../modal/search-product/search-product.page';
import { AlertService } from 'src/app/services/alert/alert.service';
import { PausedPage } from '../modal/paused/paused.page';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  @ViewChild(IonSegment) segment: IonSegment;

  public sessions: Array<any>;

  public subcategories: Array<any>;

  public products: Array<any>;

  public allProducts: Array<any>;

  constructor(
    private modalCtrl: ModalController,
    private popoverController: PopoverController,
    private productSrv: ProductService,
    private menuSessionSrv: MenuSessionService,
    private loadingSrv: LoadingService,
    private alertSrv: AlertService,
    private toastSrv: ToastService
  ) { }

  ngOnInit() {

    this.prepareSubcategories();

    this.prepareSessions();
  }

  public async options(ev: any) {

    const popover = await this.popoverController.create({
      component: ProductOptionsPage,
      event: ev,
      translucent: true,
      mode: 'md'
    });

    popover.onWillDismiss()
      .then(res => {

        switch (res.data) {

          case 'add_session':
            this.openAddSession();
            break;

          case 'edit_sessions':
            this.openSessions();
            break;

          case 'search_product':
            this.openSearch();
            break;

          case 'paused':
            this.openPaused();
            break;

        }

      });

    return await popover.present();

  }

  public segmentChanged() {

    let session = document.getElementById(`session${this.segment.value}`);

    session.scrollIntoView({ behavior: "smooth", inline: "center" });

    this.filterProducts();

  }

  public details(product_id: number) {

    this.loadingSrv.show();

    this.productSrv.getById(product_id)
      .subscribe(async res => {

        if (res.success) {

          const index = ArrayHelper.getIndexByKey(this.sessions, 'id', res.data.menu_session_id);

          const modal = await this.modalCtrl.create({
            component: ProductDetailsPage,
            cssClass: 'modal-custom',
            componentProps: {
              product: res.data,
              session: this.sessions[index],
              subcategories: this.subcategories
            }
          });

          modal.onWillDismiss()
            .then(res => {

              if (res.data != undefined) {

                const index = ArrayHelper.getIndexByKey(this.allProducts, 'id', product_id);

                this.allProducts[index] = res.data;

                this.filterProducts();

              }

            });

          await modal.present();

          this.loadingSrv.hide();

        }

      });

  }

  public async addProduct() {

    const modal = await this.modalCtrl.create({
      component: AddProductPage,
      cssClass: 'modal-custom',
      backdropDismiss: false,
      componentProps: {
        sessions: this.sessions
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          this.segment.value = res.data.menu_session_id;

          this.allProducts.push(res.data);

          this.filterProducts();

        }

      });

    return await modal.present();

  }

  public updateStatus(product: any) {

    const action = product.status == 1 ? 'Pausar' : 'Ativar';

    this.alertSrv.confirm(`${action} este produto?`, () => {

      this.loadingSrv.show();

      const formData = new FormData();

      formData.append('status', product.status == 1 ? '0' : '1');

      this.productSrv.update(product.id, formData)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            if (res.data.status == 1) {

              this.toastSrv.success('Produto ativado com sucesso!');

            }

            else {

              this.toastSrv.secondary('Produto pausado com sucesso!');

            }

            const index = ArrayHelper.getIndexByKey(this.allProducts, 'id', product.id);

            this.allProducts[index] = res.data;

            this.filterProducts();

          }

        });

    });

  }

  public remove(product_id: number) {

    this.alertSrv.confirm('Apagar este produto?', () => {

      this.loadingSrv.show();

      this.productSrv.delete(product_id)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            this.toastSrv.success(res.message);

            const index = ArrayHelper.getIndexByKey(this.allProducts, 'id', product_id);

            this.allProducts = ArrayHelper.removeItem(this.allProducts, index);

            this.filterProducts();

          }

        });

    });

  }

  private async openSessions() {

    const modal = await this.modalCtrl.create({
      component: MenuSessionsPage,
      cssClass: 'modal-custom',
      backdropDismiss: false
    });

    modal.onWillDismiss()
      .then(res => {

        this.sessions = res.data;

      });

    return await modal.present();

  }

  private async openAddSession() {

    const modal = await this.modalCtrl.create({
      component: AddSessionPage,
      cssClass: 'modal-custom',
      backdropDismiss: false
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          this.sessions.push(res.data);

        }

      });

    return await modal.present();

  }

  private async openSearch() {

    const modal = await this.modalCtrl.create({
      component: SearchProductPage,
      cssClass: 'modal-custom',
      backdropDismiss: false,
      componentProps: {
        products: this.allProducts,
        sessions: this.sessions,
        subcategories: this.subcategories
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          this.allProducts = res.data;

        }

      });

    return await modal.present();

  }

  private async openPaused() {

    const modal = await this.modalCtrl.create({
      component: PausedPage,
      cssClass: 'modal-custom',
      backdropDismiss: false,
      componentProps: {
        products: this.allProducts,
        sessions: this.sessions,
        subcategories: this.subcategories
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          this.allProducts = res.data;

          this.filterProducts();

        }

      });

    return await modal.present();

  }

  private filterProducts() {

    this.products = [];

    this.allProducts.forEach(element => {

      if (element.menu_session_id == this.segment.value) {

        this.products.push(element);

      }

      this.products = ArrayHelper.orderbyAsc(this.products, 'name');

    });

  }

  private prepareSessions() {

    this.loadingSrv.show();

    this.menuSessionSrv.get()
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.sessions = res.data;

          if (this.sessions.length > 0) {
            this.prepareProducts();
          }

        }
      });

  }

  private prepareSubcategories() {

    this.loadingSrv.show();

    this.productSrv.getSubcategories()
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.subcategories = res.data;

        }

      });

  }

  private prepareProducts() {

    this.loadingSrv.show();

    this.productSrv.getAll()
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.allProducts = res.data;

          this.filterProducts();

        }
      });

  }
}