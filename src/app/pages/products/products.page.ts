import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { LoadingService } from '../../services/loading/loading.service';
import { ProductOptionsPage } from '../popover/product-options/product-options.page';
import { ProductService } from '../../services/product/product.service';
import { ProductDetailsPage } from '../modal/product-details/product-details.page';
import { MenuSessionsPage } from '../modal/menu-sessions/menu-sessions.page';
import { AddSessionPage } from '../modal/add-session/add-session.page';
import { AddProductPage } from '../modal/add-product/add-product.page';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  public sessions: Array<any> = [];

  public subcategories: Array<any> = [];

  public products: Array<any> = [];

  public allProducts: Array<any> = [];

  constructor(
    private modalCtrl: ModalController,
    private popoverController: PopoverController,
    private productSrv: ProductService,
    private loadingSrv: LoadingService
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
      cssClass: 'popover-custom',
      mode: 'ios'
    });

    popover.onWillDismiss()
      .then(res => {

        switch (res.data) {

          case 'sessions':
            this.openSessions();
            break;

          case 'add_session':
            this.openAddSession();
            break;

          case 'add_product':
            this.openAddProduct();
            break;

        }

      });

    return await popover.present();

  }

  public changeSession(session_id: number) {

    let session = document.getElementById(`session${session_id}`);

    session.scrollIntoView({ behavior: "smooth", inline: "center" });

    this.filterProducts(session_id);
  }

  public details(product_id: number) {

    this.loadingSrv.show();

    this.productSrv.getById(product_id)
      .subscribe(async res => {

        if (res.success) {

          const modal = await this.modalCtrl.create({
            component: ProductDetailsPage,
            cssClass: 'modal-custom',
            componentProps: {
              product: res.data,
              sessions: this.sessions,
              subcategories: this.subcategories
            }
          });

          await modal.present();

          modal.onWillDismiss()
            .then(res => {

              const index = ArrayHelper.getIndexByKey(this.products, 'id', product_id);

              this.products[index] = res.data;

            });

          this.loadingSrv.hide();

          return;

        }

        else {

          this.loadingSrv.hide();

        }

      });

  }

  private async openSessions() {

    const modal = await this.modalCtrl.create({
      component: MenuSessionsPage,
      cssClass: 'modal-custom',
      backdropDismiss: false,
      componentProps: {
        sessions: this.sessions
      }
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

  private async openAddProduct() {

    const modal = await this.modalCtrl.create({
      component: AddProductPage,
      cssClass: 'modal-custom',
      backdropDismiss: false
    });

    return await modal.present();

  }

  private filterProducts(session_id: number) {

    this.products = [];

    this.allProducts.forEach(element => {

      if (element.menu_session_id == session_id) {

        this.products.push(element);

      }

    });

  }

  private prepareSessions() {

    this.loadingSrv.show();

    this.productSrv.getSessions()
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.sessions = res.data;

          if (res.data.length > 0) {
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

          this.filterProducts(this.sessions[0].id);

        }
      });

  }
}