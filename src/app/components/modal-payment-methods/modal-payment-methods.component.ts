import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-payment-methods',
  templateUrl: './modal-payment-methods.component.html',
  styleUrls: ['./modal-payment-methods.component.scss'],
})
export class ModalPaymentMethodsComponent implements OnInit, OnDestroy {

  public loading: boolean;

  public company: any;

  public paymentMethods: any[];

  public selecteds: any[] = [];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private apiSrv: ApiService,
    private modalCtrl: ModalController,
    private alertSrv: AlertService,
    private navParams: NavParams
  ) { }

  ngOnInit() {

    this.company = this.navParams.get('company');

    this.preparePaymentMethods();

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  public dismiss() {

    if (this.selecteds.length == 0) {

      this.alertSrv.show({
        icon: 'warning',
        message: 'Você precisa selecionar algum método para permitir pagamentos na entrega. Deseja continuar?',
        confirmButtonText: 'Continuar',
        onConfirm: () => {

        },
        onCancel: () => {
          this.modalCtrl.dismiss();
        }
      });

    }

    else {

      this.alertSrv.show({
        icon: 'warning',
        message: 'Se cancelar você não poderá oferecer pagamentos na entrega. Deseja continuar?',
        confirmButtonText: 'Continuar',
        onConfirm: () => {

        },
        onCancel: () => {
          this.modalCtrl.dismiss();
        }
      });

    }

  }

  public confirm() {
    
    if (this.selecteds.length == 0) {

      this.alertSrv.show({
        icon: 'warning',
        message: 'Você precisa selecionar algum método para permitir pagamentos na entrega. Deseja continuar?',
        confirmButtonText: 'Continuar',
        onConfirm: () => {

        },
        onCancel: () => {
          this.modalCtrl.dismiss();
        }
      });

    }

    else {

      this.modalCtrl.dismiss(this.selecteds);

    }

  }

  public check(event: CustomEvent) {

    if (event.detail.checked) {

      this.selecteds.push(event.detail.value);

    }

    else {

      const index = this.selecteds.indexOf(event.detail.value);

      this.selecteds = ArrayHelper.removeItem(this.selecteds, index);

    }

  }

  private preparePaymentMethods() {
    this.loading = true;
    this.apiSrv.getPaymentMethods()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        this.paymentMethods = res.data;
        this.paymentMethods.forEach((paymentMethod) => {
          if (ArrayHelper.exist(this.company.payment_methods, 'id', paymentMethod.id)) {
            this.selecteds.push(paymentMethod.id);
            paymentMethod.checked = true;
          }
          else {
            paymentMethod.checked = false;
          }
        });
      });
  }

}
