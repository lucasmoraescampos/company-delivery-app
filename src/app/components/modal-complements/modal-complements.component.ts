import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, NavParams } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { AlertService } from 'src/app/services/alert.service';
import { ComplementService } from 'src/app/services/complement.service';
import { SubcomplementService } from 'src/app/services/subcomplement.service';
import { ModalComplementComponent } from '../modal-complement/modal-complement.component';
import { ModalSubcomplementComponent } from '../modal-subcomplement/modal-subcomplement.component';

@Component({
  selector: 'app-modal-complements',
  templateUrl: './modal-complements.component.html',
  styleUrls: ['./modal-complements.component.scss'],
})
export class ModalComplementsComponent implements OnInit, OnDestroy {

  @ViewChild(IonSlides) slides: IonSlides;

  public loading: boolean;

  public slideActiveIndex = 0;

  public product: any;

  public complementActiveIndex: any;

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private subcomplementSrv: SubcomplementService,
    private complementSrv: ComplementService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {
    this.product = this.navParams.get('product');
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

  public prev() {
    this.slideActiveIndex--;
    this.slides.slidePrev();
  }

  public next(index: number) {
    this.complementActiveIndex = index;
    this.slideActiveIndex++;
    this.slides.slideNext();
  }

  public async modalComplement(index?: number) {

    const complement = this.product.complements[index];

    const modal = await this.modalCtrl.create({
      component: ModalComplementComponent,
      backdropDismiss: false,
      cssClass: 'modal-sm',
      componentProps: {
        product_id: this.product.id,
        complement: complement
      }
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          if (index) {
            this.product.complements[index] = res.data;
          }
          else {
            this.product.complements.push(res.data);
          }
        }
      });

    return await modal.present();

  }

  public async modalSubcomplement(index?: number) {    

    const complement = this.product.complements[this.complementActiveIndex];

    const modal = await this.modalCtrl.create({
      component: ModalSubcomplementComponent,
      backdropDismiss: false,
      cssClass: 'modal-sm',
      componentProps: {
        complement_id: complement.id,
        subcomplement: this.product.complements[this.complementActiveIndex].subcomplements[index]
      }
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          if (index !== undefined) {
            this.product.complements[this.complementActiveIndex].subcomplements[index] = res.data;
          }
          else {
            this.product.complements[this.complementActiveIndex].subcomplements.push(res.data);
          }
        }
      });

    return await modal.present();

  }

  public deleteSubcomplement(index: number) {

    const subcomplements = this.product.complements[this.complementActiveIndex].subcomplements;

    this.alertSrv.show({
      icon: 'warning',
      message: `Você está prestes a excluír a opção "${subcomplements[index].description}"`,
      confirmButtonText: 'Excluir',
      onConfirm: () => {

        this.loading = true;

        this.subcomplementSrv.delete(subcomplements[index].id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

            if (res.success) {

              this.product.complements[this.complementActiveIndex].subcomplements = ArrayHelper.removeItem(subcomplements, index);

            }

          });
      }
    });

  }

  public deleteComplement(index: number) {

    const complement = this.product.complements[index];

    this.alertSrv.show({
      icon: 'warning',
      message: `Você está prestes a excluír o complemento "${complement.title}"`,
      confirmButtonText: 'Excluir',
      onConfirm: () => {

        this.loading = true;

        this.complementSrv.delete(complement.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

            if (res.success) {

              this.product.complements = ArrayHelper.removeItem(this.product.complements, index);

              this.prev();
              
            }

          });
      }
    });

  }

}
