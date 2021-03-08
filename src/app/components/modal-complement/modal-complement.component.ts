import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComplementService } from 'src/app/services/complement.service';

@Component({
  selector: 'app-modal-complement',
  templateUrl: './modal-complement.component.html',
  styleUrls: ['./modal-complement.component.scss'],
})
export class ModalComplementComponent implements OnInit, OnDestroy {

  public loading: boolean;

  public submitAttempt: boolean;

  public complement: any;

  public formGroup: FormGroup;

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private complementSrv: ComplementService
  ) { }

  ngOnInit() {

    this.complement = this.navParams.get('complement');

    const product_id = this.navParams.get('product_id');

    this.formGroup = this.formBuilder.group({
      product_id: [product_id, Validators.required],
      title: [this.complement?.title ?? '', Validators.required],
      qty_min: [String(this.complement?.qty_min) ?? ''],
      qty_max: [String(this.complement?.qty_max) ?? '', Validators.required],
      required: [this.complement?.required ?? false, Validators.required]
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

  public checkQtyMax() {
    if (!this.formControl.qty_max.errors) {
      if (this.formControl.qty_max.value == 0) {
        this.formControl.qty_max.setErrors({ zero: true });
      }
      else {
        this.formControl.qty_max.setErrors(null);
      }
    }
  }

  public checkQtyMin() {
    if (!this.formControl.qty_min.errors) {
      if (this.formControl.qty_min.value === 0) {
        this.formControl.qty_min.setErrors({ zero: true });
      }
      else if (this.formControl.qty_min.value > this.formControl.qty_max.value) {
        this.formControl.qty_min.setErrors({ limit: true });
      }
      else {
        this.formControl.qty_min.setErrors(null);
      }
    }
  }

  public changeRequired(ev: any) {
    if (ev.detail.checked) {
      this.formGroup.patchValue({ required: true });
      this.formControl.qty_min.setValidators(Validators.required);
    }
    else {
      this.formGroup.patchValue({ required: false, qty_min: null });
      this.formControl.qty_min.clearValidators();
    }
    this.formControl.qty_min.updateValueAndValidity();
  }

  public save() {

    this.submitAttempt = true;

    if (this.formGroup.valid) {

      this.loading = true;

      const data = this.formGroup.value;
      
      if (data.required == false) {
        delete data.qty_min;
      }

      if (this.complement) {

        this.complementSrv.update(this.complement.id, data)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

            if (res.success) {
              this.modalCtrl.dismiss(res.data);
            }

          });

      }

      else {

        this.complementSrv.create(data)
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
