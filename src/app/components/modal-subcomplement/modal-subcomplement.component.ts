import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { SubcomplementService } from 'src/app/services/subcomplement.service';

@Component({
  selector: 'app-modal-subcomplement',
  templateUrl: './modal-subcomplement.component.html',
  styleUrls: ['./modal-subcomplement.component.scss'],
})
export class ModalSubcomplementComponent implements OnInit, OnDestroy {

  public loading: boolean;

  public submitAttempt: boolean;

  public subcomplement: any;

  public isSubcomplementFree: boolean;

  public formGroup: FormGroup;

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private subcomplementSrv: SubcomplementService
  ) { }

  ngOnInit() {

    const complement_id = this.navParams.get('complement_id');

    this.subcomplement = this.navParams.get('subcomplement');

    this.isSubcomplementFree = this.subcomplement ? this.subcomplement.price === null : false;

    this.formGroup = this.formBuilder.group({
      complement_id: [complement_id, Validators.required],
      description: [this.subcomplement ? this.subcomplement.description : '', Validators.required],
      price: [
        this.subcomplement ? UtilsHelper.numberToMoney(this.subcomplement.price) : '',
        this.isSubcomplementFree ? null : Validators.required
      ]
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

  public checkPrice() {
    if (!this.formControl.price.errors) {
      const price = UtilsHelper.moneyToNumber(this.formControl.price.value);
      if (price == 0) {
        this.formControl.price.setErrors({ zero: true });
      }
      else {
        this.formControl.price.setErrors(null);
      }
    }
  }

  public changeSubcomplementFree(ev: any) {

    this.isSubcomplementFree = ev.detail.checked;

    if (this.isSubcomplementFree) {
      this.formGroup.patchValue({ price: null });
      this.formControl.price.clearValidators();
    }

    else {
      this.formGroup.patchValue({ price: '0,00' });
      this.formControl.price.setValidators(Validators.required);
    }

    this.formControl.price.updateValueAndValidity();

  }

  public save() {

    this.submitAttempt = true;

    if (!this.isSubcomplementFree) {
      this.checkPrice();
    }

    if (this.formGroup.valid) {

      this.loading = true;

      const data = this.formGroup.value;
      
      if (this.isSubcomplementFree) {
        delete data.price;
      }

      else {
        data.price = UtilsHelper.moneyToNumber(data.price);
      }

      if (this.subcomplement) {

        this.subcomplementSrv.update(this.subcomplement.id, data)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

            if (res.success) {
              this.modalCtrl.dismiss(res.data);
            }

          });

      }

      else {

        this.subcomplementSrv.create(data)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

            if (res.success) {
              this.modalCtrl.dismiss(res.data);
            }

          });

      }

    }

  }

}
