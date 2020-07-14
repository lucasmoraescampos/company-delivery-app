import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ProductService } from 'src/app/services/product/product.service';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';

@Component({
  selector: 'app-paused',
  templateUrl: './paused.page.html',
  styleUrls: ['./paused.page.scss'],
})
export class PausedPage implements OnInit {

  public products: Array<any>;

  public allProducts: Array<any>;

  public loading: boolean = false;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private alertSrv: AlertService,
    private productSrv: ProductService
  ) { }

  ngOnInit() {

    this.allProducts = this.navParams.get('products');

    this.products = [];

    this.allProducts.forEach(product => {
      if (product.status == 0) {
        this.products.push(product);
      }
    });

  }

  public dismiss() {
    this.modalCtrl.dismiss(this.allProducts);
  }

  public updateStatus(product: any) {

    this.alertSrv.confirm(`Ativar este produto?`, () => {

      this.loading = true;

      const formData = new FormData();

      formData.append('status', '1');

      this.productSrv.update(product.id, formData)
        .subscribe(res => {

          this.loading = false;

          if (res.success) {

            let index = ArrayHelper.getIndexByKey(this.products, 'id', product.id);

            this.products = ArrayHelper.removeItem(this.products, index);

            index = ArrayHelper.getIndexByKey(this.allProducts, 'id', product.id);

            this.allProducts[index] = res.data;

          }

        });

    });

  }

  public remove(product: any) {

    this.alertSrv.confirm('Apagar este produto?', () => {

      this.loading = true;

      this.productSrv.delete(product.id)
        .subscribe(res => {

           this.loading = false;

          if (res.success) {

            let index = ArrayHelper.getIndexByKey(this.products, 'id', product.id);

            this.products = ArrayHelper.removeItem(this.products, index);

            index = ArrayHelper.getIndexByKey(this.allProducts, 'id', product.id);

            this.allProducts[index] = res.data;

          }

        });

    });

  }

}
