import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { ModalCompanyDeliverymenListComponent } from '../modal-company-deliverymen-list/modal-company-deliverymen-list.component';

@Component({
  selector: 'app-modal-order',
  templateUrl: './modal-order.component.html',
  styleUrls: ['./modal-order.component.scss'],
})
export class ModalOrderComponent implements OnInit, OnDestroy {

  @Input() order: any;

  public loading: boolean;

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private orderSrv: OrderService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    console.log(this.order)

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public dismiss() {
    this.modalCtrl.dismiss(this.order);
  }

  public refuse() {

    this.alertSrv.show({
      icon: 'warning',
      message: 'Você está prestes a recusar este pedido. Deseja continuar?',
      confirmButtonText: 'Continuar',
      onConfirm: () => {
        this.update({ status: 5 });
      }
    });

  }

  public accept() {

    this.alertSrv.show({
      icon: 'warning',
      message: 'Você está prestes a aceitar este pedido. Deseja continuar?',
      confirmButtonText: 'Continuar',
      onConfirm: () => {
        this.update({ status: 1 });
      }
    });

  }

  public async chooseDeliveryman() {

    const modal = await this.modalCtrl.create({
      component: ModalCompanyDeliverymenListComponent,
      backdropDismiss: false,
      cssClass: 'modal-sm',
      componentProps: {
        order: this.order
      }
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          this.update({ status: 2, company_deliveryman_id: res.data.id });
        }        
      });

    return await modal.present();

  }

  private update(data: any) {

    this.loading = true;

    this.orderSrv.update(this.order.id, data)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loading = false;

        if (res.success) {

          this.order = res.data;

          if (data.status == 5) {
            this.modalCtrl.dismiss(this.order);
          }

        }

      });

  }

}
