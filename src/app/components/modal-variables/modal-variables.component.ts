import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { AlertService } from 'src/app/services/alert.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-modal-variables',
  templateUrl: './modal-variables.component.html',
  styleUrls: ['./modal-variables.component.scss'],
})
export class ModalVariablesComponent implements OnInit, OnDestroy {

  public loading: boolean;

  public submitAttempt: boolean;

  public company: any;

  public formGroup: FormGroup;

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    public companySrv: CompanyService,
    public alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.company = this.companySrv.getCurrentCompany();

    this.formGroup = this.formBuilder.group({
      min_order_value: [UtilsHelper.numberToMoney(this.company.min_order_value), Validators.required],
      waiting_time: [String(this.company.waiting_time), Validators.required],
      delivery_price: [UtilsHelper.numberToMoney(this.company.delivery_price), Validators.required]
    });

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public get formControl() {
    return this.formGroup.controls;
  }

  public checkWaitingTime() {

    if (this.formControl.waiting_time.value.length == 0) return;

    this.formControl.waiting_time.setErrors(null);

    const waiting_time = Number(this.formControl.waiting_time.value);

    if (waiting_time == 0) {

      this.formControl.waiting_time.setErrors({ zero: true });

    }

  }

  public save() {

    this.submitAttempt = true;

    if (this.formGroup.valid) {

      this.loading = true;

      const data: any = {
        min_order_value: UtilsHelper.moneyToNumber(this.formControl.min_order_value.value),
        waiting_time: this.formControl.waiting_time.value,
        delivery_price: UtilsHelper.moneyToNumber(this.formControl.delivery_price.value)
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

}
