import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, ModalController, NavParams } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.scss'],
})
export class ModalProductComponent implements OnInit, OnDestroy {

  @ViewChild(IonSlides) slides: IonSlides;

  public loading: boolean;

  public slideActiveIndex = 0;

  public submitAttempt1: boolean;

  public submitAttempt2: boolean;

  public submitAttempt3: boolean;

  public segments: any[];

  public product: any;

  public blob: Blob;

  public allTimes: boolean;

  public formGroup1: FormGroup;

  public formGroup2: FormGroup;

  public formGroup3: FormGroup;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private alertSrv: AlertService,
    private productSrv: ProductService
  ) { }

  ngOnInit() {

    this.segments = this.navParams.get('segments');

    this.product = this.navParams.get('product');

    this.allTimes = this.product && this.product.start_time == '00:00:00' && this.product.end_time == '00:00:00';

    this.formGroup1 = this.formBuilder.group({
      name: [this.product?.name, Validators.required],
      segment_id: [this.product?.segment_id, Validators.required],
      price: [this.product ? UtilsHelper.numberToMoney(this.product.price) : '', Validators.required],
      description: [this.product?.description, Validators.required]
    });

    this.formGroup2 = this.formBuilder.group({
      has_sunday: [this.product?.has_sunday == true, Validators.required],
      has_monday: [this.product?.has_monday == true, Validators.required],
      has_tuesday: [this.product?.has_tuesday == true, Validators.required],
      has_wednesday: [this.product?.has_wednesday == true, Validators.required],
      has_thursday: [this.product?.has_thursday == true, Validators.required],
      has_friday: [this.product?.has_friday == true, Validators.required],
      has_saturday: [this.product?.has_saturday == true, Validators.required]
    });

    this.formGroup3 = this.formBuilder.group({
      start_time: [this.product?.start_time, this.allTimes ? null : Validators.required],
      end_time: [this.product?.end_time, this.allTimes ? null : Validators.required]
    });

  }

  ionViewDidEnter() {
    this.slides.update();
  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  public get formControl1() {
    return this.formGroup1.controls;
  }

  public get formControl2() {
    return this.formGroup2.controls;
  }

  public get formControl3() {
    return this.formGroup3.controls;
  }

  public get formGroup2IsValid() {
    return this.formControl2.has_sunday.value  == true
      || this.formControl2.has_monday.value    == true
      || this.formControl2.has_tuesday.value   == true
      || this.formControl2.has_wednesday.value == true
      || this.formControl2.has_thursday.value  == true
      || this.formControl2.has_friday.value    == true
      || this.formControl2.has_saturday.value  == true;
  }

  public dismiss() {
    if (this.product) {
      this.modalCtrl.dismiss();
    }
    else {
      this.alertSrv.show({
        icon: 'question',
        message: 'Se você sair todos os dados informados serão descartados. Deseja realmente sair?',
        confirmButtonText: 'Sair',
        onConfirm: () => {
          this.modalCtrl.dismiss();
        }
      });
    }
  }

  public prev() {
    if (this.slideActiveIndex > 0) {
      this.slideActiveIndex--;
    }
    this.slides.slidePrev();
  }

  public next() {

    if (this.slideActiveIndex == 0) {

      this.submitAttempt1 = true;

      if ((this.formGroup1.valid && this.blob) || (this.formGroup1.valid && !this.blob && this.product)) {

        this.slideActiveIndex++;

        this.slides.slideNext();

      }

    }

    else if (this.slideActiveIndex == 1) {

      this.submitAttempt2 = true;

      if (this.formGroup2.valid) {

        this.slideActiveIndex++;

        this.slides.slideNext();

      }

    }

  }

  public save() {

    this.submitAttempt3 = true;

    if (this.formGroup3.valid) {

      this.loading = true;

      const formData = new FormData();

      const price = UtilsHelper.moneyToNumber(this.formControl1.price.value);

      const has_sunday = this.formControl2.has_sunday.value == true ? '1' : '0';
      const has_monday = this.formControl2.has_monday.value == true ? '1' : '0';
      const has_tuesday = this.formControl2.has_tuesday.value == true ? '1' : '0';
      const has_wednesday = this.formControl2.has_wednesday.value == true ? '1' : '0';
      const has_thursday = this.formControl2.has_thursday.value == true ? '1' : '0';
      const has_friday = this.formControl2.has_friday.value == true ? '1' : '0';
      const has_saturday = this.formControl2.has_saturday.value == true ? '1' : '0';
      
      formData.append('name', this.formControl1.name.value);
      formData.append('segment_id', this.formControl1.segment_id.value);
      formData.append('price', String(price));
      formData.append('description', this.formControl1.description.value);
      formData.append('has_sunday', has_sunday);
      formData.append('has_monday', has_monday);
      formData.append('has_tuesday', has_tuesday);
      formData.append('has_wednesday', has_wednesday);
      formData.append('has_thursday', has_thursday);
      formData.append('has_friday', has_friday);
      formData.append('has_saturday', has_saturday);

      if (this.blob) {
        formData.append('image', this.blob);
      }

      if (!this.allTimes) {
        formData.append('start_time', this.formControl3.start_time.value);
        formData.append('end_time', this.formControl3.end_time.value);
      }

      if (this.product) {

        const id = this.product.id;

        this.productSrv.update(id, formData)
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

      else {

        this.productSrv.create(formData)
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

  public checkPrice() {

    if (!this.formControl1.price.errors) {

      const price = UtilsHelper.moneyToNumber(this.formControl1.price.value);

      if (price == 0) {

        this.formControl1.price.setErrors({ zero: true });

      }

      else {

        this.formControl1.price.setErrors(null);

      }

    }

  }

  public checkStartTime() {

    this.formControl3.start_time.setErrors(null);

    if (!this.allTimes && this.formControl3.start_time.value.length > 0) {

      if (this.formControl3.start_time.value.length == 5) {

        const time = this.formControl3.start_time.value.split(':');

        const hours = Number(time[0]);

        const minutes = Number(time[1]);

        if (hours > 23 || minutes > 59) {

          this.formControl3.start_time.setErrors({ time: true });

        }

      }

      else {

        this.formControl3.start_time.setErrors({ time: true });

      }

    }

  }

  public checkEndTime() {

    this.formControl3.end_time.setErrors(null);

    if (!this.allTimes && this.formControl3.end_time.value.length > 0) {

      if (this.formControl3.end_time.value.length == 5) {

        const time = this.formControl3.end_time.value.split(':');

        const hours = Number(time[0]);

        const minutes = Number(time[1]);

        if (hours > 23 || minutes > 59) {

          this.formControl3.end_time.setErrors({ time: true });

        }

      }

      else {

        this.formControl3.end_time.setErrors({ time: true });

      }

    }

  }

  public changeTimes(event: any) {
    if (event.detail.checked) {
      this.allTimes = true;
      this.formControl3.start_time.clearValidators();
      this.formControl3.end_time.clearValidators();
    }
    else {
      this.allTimes = false;
      this.formControl3.start_time.setValidators(Validators.required);
      this.formControl3.end_time.setValidators(Validators.required);
    }
    this.formControl3.start_time.updateValueAndValidity();
    this.formControl3.end_time.updateValueAndValidity();
  }

  public changeImage(event: any) {
    this.blob = event;
  }

}