import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { CompanyService } from 'src/app/services/company.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.component.html',
  styleUrls: ['./modal-profile.component.scss'],
})
export class ModalProfileComponent implements OnInit {

  public company: any;

  public buttonText: string;

  public loading: boolean;

  public categories: any[];

  public uploadedImage: string;

  public uploadedBanner: string;

  public submitAttempt: boolean;

  readonly bannerDefault = environment.imagesUrl + '/banner.png';

  public formGroup: FormGroup;

  private unsubscribe = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private apiSrv: ApiService,
    private modalCtrl: ModalController,
    private companySrv: CompanyService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.company = this.companySrv.getCurrentCompany();

    this.formGroup = this.formBuilder.group({
      name: [this.company.name, Validators.required],
      category_id: [null, Validators.required],
      phone: [this.company.phone, [Validators.required, Validators.minLength(14)]],
      document_number: [this.company.document_number, Validators.required]
    });

    this.initCategories();

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

  public changeImage(dataUrl: string) {
    this.uploadedImage = dataUrl;
  }

  public changeBanner(dataUrl: string) {
    this.uploadedBanner = dataUrl;
  }

  public checkDocumentNumber() {

    if (this.formControl.document_number.value.length == 0) return;

    this.formControl.document_number.setErrors(null);

    if (!UtilsHelper.validateDocumentNumber(this.formControl.document_number.value)) {

      this.formControl.document_number.setErrors({ document_number: true });

    }

  }

  public save() {

    this.submitAttempt = true;

    if (this.formGroup.valid && (this.uploadedImage || this.company)) {

      this.loading = true;

      const data: any = {
        name: this.formControl.name.value,
        category_id: this.formControl.category_id.value,
        phone: this.formControl.phone.value.replace(/[^0-9]/g, ''),
        document_number: this.formControl.document_number.value.replace(/[^0-9]/g, ''),
      }

      if (this.uploadedImage) {
        data.image = this.uploadedImage;
      }

      if (this.uploadedBanner) {
        data.banner = this.uploadedBanner;
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

  private initCategories() {
    this.loading = true;
    this.apiSrv.getCategories()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        this.categories = res.data
        this.formGroup.patchValue({ category_id: this.company.category_id });
      });
  }

}
