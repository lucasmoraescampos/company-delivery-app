import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { AlertService } from 'src/app/services/alert.service';
import { SegmentService } from 'src/app/services/segment.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ProductService } from 'src/app/services/product.service';
import { ModalComplementsComponent } from '../../components/modal-complements/modal-complements.component';
import { ModalProductComponent } from '../../components/modal-product/modal-product.component';
import { ModalSearchProductComponent } from '../../components/modal-search-product/modal-search-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, OnDestroy {

  public segments: any[];

  public products: any[];

  private unsubscribe: Subject<void> = new Subject();
  
  constructor(
    private modalCtrl: ModalController,
    private segmentSrv: SegmentService,
    private productSrv: ProductService,
    private loadingSrv: LoadingService,
    private actionSheetCtrl: ActionSheetController,
    private alertSrv: AlertService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {

    this.prepareSegments();

    this.prepareProducts();

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  public async options(product: any) {

    const actionSheet = await this.actionSheetCtrl.create({
      header: product.name,
      buttons: [{
        text: 'Editar',
        handler: () => {
          this.modalProduct(product);
        }
      }, {
        text: 'Complementos',
        handler: () => {
          this.modalComplements(product);
        }
      }, {
        text: product.status ? 'Pausar' : 'Ativar',
        handler: () => {
          this.updateStatus(product);
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

  public async modalProduct(product?: any) {

    if (this.segments?.length > 0) {

      const modal = await this.modalCtrl.create({
        component: ModalProductComponent,
        backdropDismiss: false,
        cssClass: 'modal-lg',
        componentProps: {
          segments: this.segments,
          product: product
        }
      });

      modal.onWillDismiss()
        .then(res => {

          if (res.data) {

            if (product) {

              const index = ArrayHelper.getIndexByKey(this.products, 'id', product.id);

              this.products[index] = res.data;

            }

            else {

              this.products.unshift(res.data);

            }

          }

        });

      return await modal.present();

    }

    else {

      this.alertSrv.show({
        icon: 'warning',
        message: 'Antes de cadastrar seus produtos você precisa cadastrar seus segmentos.',
        confirmButtonText: 'Segmentos',
        onConfirm: () => {
          this.navCtrl.navigateForward('/segments');
        }
      });

    }

  }

  public async modalSearch() {

    const modal = await this.modalCtrl.create({
      component: ModalSearchProductComponent,
      backdropDismiss: false,
      cssClass: 'modal-xl',
      componentProps: {
        products: this.products
      }
    });

    return await modal.present();

  }

  public async modalComplements(product: any) {

    const modal = await this.modalCtrl.create({
      component: ModalComplementsComponent,
      backdropDismiss: false,
      componentProps: {
        product: product
      }
    });

    modal.onWillDismiss()
      .then(res => {
        
      });

    return await modal.present();

  }

  private updateStatus(product: any) {

    const action = product.status ? 'Pausar' : 'Ativar';

    const formData = new FormData();

    formData.append('status', product.status ? '0' : '1');

    this.alertSrv.show({
      icon: 'warning',
      message: `Você está prestes a ${action.toLowerCase()} o produto "${product.name}"`,
      confirmButtonText: action,
      onConfirm: () => {

        this.loadingSrv.show();

        this.productSrv.update(product.id, formData)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loadingSrv.hide();

            if (res.success) {

              let message: string;

              if (res.data.status) {
                message = 'Produto ativado com sucesso';
              }

              else {
                message = 'Produto pausado com sucesso';
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
      icon: 'warning',
      message: `Você esta prestes a excluir o produto "${product.name}"`,
      confirmButtonText: 'Excluir',
      onConfirm: () => {
        
        this.loadingSrv.show();

        this.productSrv.delete(product.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loadingSrv.hide();

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

  private prepareProducts() {
    this.loadingSrv.show();
    this.productSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loadingSrv.hide();
        if (res.success) {
          this.products = res.data;
        }
      });
  }

  private prepareSegments() {
    this.loadingSrv.show();
    this.segmentSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loadingSrv.hide();
        if (res.success) {
          this.segments = res.data;
        }
      });
  }

}
