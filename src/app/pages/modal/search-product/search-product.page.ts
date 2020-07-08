import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductDetailsPage } from '../product-details/product-details.page';

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
    private productSrv: ProductService
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

      setTimeout(() => {

        this.results = ArrayHelper.orderbyAsc(results, 'name');

        this.loading = false;

      }, 1000);
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