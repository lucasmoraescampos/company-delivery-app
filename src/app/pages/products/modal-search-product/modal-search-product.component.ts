import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavParams } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { StringHelper } from 'src/app/helpers/string.helper';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';
import { ModalProductComponent } from '../modal-product/modal-product.component';

@Component({
  selector: 'app-modal-search-product',
  templateUrl: './modal-search-product.component.html',
  styleUrls: ['./modal-search-product.component.scss'],
})
export class ModalSearchProductComponent implements OnInit, OnDestroy {

  public loading: boolean;

  public categories: any[];

  public products: any[];

  public results: any[];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertSrv: AlertService,
    private productSrv: ProductService,
    private navParams: NavParams
  ) { }

  ngOnInit() {

    this.categories = this.navParams.get('categories');

    this.products = this.navParams.get('products');

    this.results = this.products;

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public changedSearch(event: CustomEvent) {

    const search = StringHelper.normalize(event.detail.value);

    if (search.length > 0) {

      this.results = [];

      this.products.forEach(product => {

        let name = StringHelper.normalize(product.name);

        let category = StringHelper.normalize(product.category.name);

        if (name.match(new RegExp(search, 'gi')) || category.match(new RegExp(search, 'gi'))) {

          this.results.push(product);

        }

      });

    }

    else {

      this.results = this.products;

    }

  }

  public async options(product: any) {

    const actionSheet = await this.actionSheetCtrl.create({
      header: product.name,
      buttons: [{
        text: product.status ? 'Inativar' : 'Ativar',
        handler: () => {
          this.updateStatus(product);
        }
      }, {
        text: 'Editar',
        handler: () => {
          this.modalProduct(product);
        }
      }, {
        text: 'Excluir',
        handler: () => {
          this.deleteProduct(product);
        }
      }, {
        text: 'Cancelar',
        role: 'cancel'
      }]
    });

    await actionSheet.present();

  }

  public async modalProduct(product: any) {

    const modal = await this.modalCtrl.create({
      component: ModalProductComponent,
      backdropDismiss: false,
      componentProps: {
        categories: this.categories,
        product: product
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data) {
          
          const index = ArrayHelper.getIndexByKey(this.products, 'id', product.id);

          this.products[index] = res.data;

        }

      });

    return await modal.present();

  }

  private updateStatus(product: any) {

    const action = product.status ? 'Inativar' : 'Ativar';

    const formData = new FormData();

    formData.append('status', product.status ? '0' : '1');

    this.alertSrv.show({
      icon: 'question',
      message: `${action} ${product.name}?`,
      confirmButtonText: action,
      onConfirm: () => {

        this.loading = true;

        this.productSrv.update(product.id, formData)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

            if (res.success) {

              let message: string;

              if (res.data.status) {
                message = 'Produto ativado com sucesso';
              }

              else {
                message = 'Produto inativado com sucesso';
              }

              this.alertSrv.toast({
                icon: 'success',
                message: message
              });

              const index = ArrayHelper.getIndexByKey(this.products, 'id', product.id);

              this.products[index] = res.data;

            }

          });

      }

    });

  }

  private deleteProduct(product: any) {

    this.alertSrv.show({
      icon: 'question',
      message: `Excluir o produto ${product.name}?`,
      confirmButtonText: 'Excluir',
      onConfirm: () => {
        
        this.loading = true;

        this.productSrv.delete(product.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

            if (res.success) {

              const index = ArrayHelper.getIndexByKey(this.products, 'id', product.id);
              
              this.products = ArrayHelper.removeItem(this.products, index);

              this.alertSrv.toast({
                icon: 'success',
                message: res.message
              });

            }

          });

      }
    });
    
  }

}
