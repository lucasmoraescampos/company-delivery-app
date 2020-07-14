import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductDetailsPage } from '../product-details/product-details.page';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.page.html',
  styleUrls: ['./search-product.page.scss'],
})
export class SearchProductPage implements OnInit {

  public loading: boolean;

  public search: string = '';

  public results: Array<any>;

  private products: Array<any>;

  private sessions: Array<any>;

  private subcategories: Array<any>;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private productSrv: ProductService,
    private alertSrv: AlertService,
    private toastSrv: ToastService
  ) { }

  ngOnInit() {

    this.products = this.navParams.get('products');

    this.sessions = this.navParams.get('sessions');

    this.subcategories = this.navParams.get('subcategories');

  }

  public dismiss() {
    this.modalCtrl.dismiss(this.products);
  }

  public doSearch() {

    if (this.search && this.search.length > 0) {

      this.loading = true;

      const search = this.normalize(this.search);

      const results = [];

      this.results = null;

      this.products.forEach(product => {

        const name = this.normalize(product.name);

        if (name.match(new RegExp(search, 'gi'))) {

          results.push(product);

        }

      });

      this.results = ArrayHelper.orderbyAsc(results, 'name');

      this.loading = false;
      
    }

  }

  public details(product_id: number) {

    this.loading = true;

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

                const index = ArrayHelper.getIndexByKey(this.products, 'id', product_id);

                this.products[index] = res.data;

                this.doSearch();
              }

            });

          await modal.present();

          this.loading = false;
          
        }

      });

  }

  public updateStatus(product: any) {

    const action = product.status == 1 ? 'Pausar' : 'Ativar';

    this.alertSrv.confirm(`${action} este produto?`, () => {

      this.loading = true;

      const formData = new FormData();

      formData.append('status', product.status == 1 ? '0' : '1');

      this.productSrv.update(product.id, formData)
        .subscribe(res => {

          this.loading = false;

          if (res.success) {

            if (res.data.status == 1) {

              this.toastSrv.success('Produto ativado com sucesso!');

            }

            else {

              this.toastSrv.secondary('Produto pausado com sucesso!');

            }

            let index = ArrayHelper.getIndexByKey(this.products, 'id', product.id);

            this.products[index] = res.data;

            index = ArrayHelper.getIndexByKey(this.results, 'id', product.id);

            this.results[index] = res.data;

          }

        });

    });

  }

  public remove(product_id: number) {

    this.alertSrv.confirm('Apagar este produto?', () => {

       this.loading= true;

      this.productSrv.delete(product_id)
        .subscribe(res => {

          this.loading = false;

          if (res.success) {

            this.toastSrv.success(res.message);

            let index = ArrayHelper.getIndexByKey(this.products, 'id', product_id);

            this.products = ArrayHelper.removeItem(this.products, index);

            index = ArrayHelper.getIndexByKey(this.results, 'id', product_id);

            this.results = ArrayHelper.removeItem(this.results, index);

          }

        });

    });

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