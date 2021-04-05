import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { CompanyService } from 'src/app/services/company.service';
import { ModalPaymentMethodsComponent } from '../modal-payment-methods/modal-payment-methods.component';

@Component({
  selector: 'app-modal-permissions',
  templateUrl: './modal-permissions.component.html',
  styleUrls: ['./modal-permissions.component.scss'],
})
export class ModalPermissionsComponent implements OnInit, OnDestroy {

  public loading: boolean;

  public company: any;

  public paymentMethods: any[];

  public selecteds: any[];

  public formGroup: FormGroup;

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private companySrv: CompanyService,
    private alertSrv: AlertService,
    private apiSrv: ApiService
  ) { }

  ngOnInit() {

    this.company = this.companySrv.getCurrentCompany();

    this.formGroup = this.formBuilder.group({
      allow_payment_online: [this.company.allow_payment_online, Validators.required],
      allow_payment_delivery: [this.company.allow_payment_delivery, Validators.required],
      allow_withdrawal_local: [this.company.allow_withdrawal_local, Validators.required],
      min_order_value: [UtilsHelper.numberToMoney(this.company.min_order_value), Validators.required],
      waiting_time: [String(this.company.waiting_time), Validators.required],
      delivery_price: [UtilsHelper.numberToMoney(this.company.delivery_price), Validators.required],
      radius: [String(this.company.radius), Validators.required]
    });

    this.initPaymentMethods();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public get formControl() {
    return this.formGroup.controls;
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public checkAllowPaymentOnline() {

    if (this.formControl.allow_payment_online.value) {

      this.alertSrv.show({
        icon: 'warning',
        message: `Uma taxa de ${String(this.company.plan.online_payment_fee).replace('.', ',')}% será cobrada por cada pagamento online.`,
        onConfirm: () => {
          this.formGroup.patchValue({ allow_payment_online: true });
        },
        onCancel: () => {
          this.formGroup.patchValue({ allow_payment_online: false });
        }
      });

    }

  }

  public checkAllowPaymentDelivery() {
    if (this.formControl.allow_payment_delivery.value) {
      this.formGroup.patchValue({ allow_payment_delivery: true });
    }
    else {
      this.formGroup.patchValue({ allow_payment_delivery: false });
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

  public save() {

    if (this.formControl.allow_payment_delivery.value && this.selecteds?.length == 0) {

      this.alertSrv.show({
        icon: 'warning',
        message: 'Você precisa selecionar os métodos de pagamento que serão aceitos na entrega. Caso não queira oferecer pagamento na entrega desmarque essa opção.',
        confirmButtonText: 'Entendi',
        showCancelButton: false
      });

    }

    else {

      this.loading = true;

      const data: any = {
        allow_payment_online: this.formControl.allow_payment_online.value,
        allow_payment_delivery: this.formControl.allow_payment_delivery.value,
        allow_withdrawal_local: this.formControl.allow_withdrawal_local.value,
      }

      if (this.formControl.allow_payment_delivery.value && this.selecteds.length > 0) {
        data.payment_methods = this.selecteds;
      }

      this.companySrv.update(this.company.id, data)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(res => {

          this.loading = false;

          if (res.success) {

            this.alertSrv.toast({
              icon: 'success',
              message: res.message
            });

            this.modalCtrl.dismiss(res.data);

          }

        });

    }

  }

  private initPaymentMethods() {
    this.loading = true;
    this.apiSrv.getPaymentMethods()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        this.paymentMethods = res.data;
        this.selecteds = [];
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
