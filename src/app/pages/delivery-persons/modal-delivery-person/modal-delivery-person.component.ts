import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { DeliveryPersonService } from 'src/app/services/delivery-person.service';

@Component({
  selector: 'app-modal-delivery-person',
  templateUrl: './modal-delivery-person.component.html',
  styleUrls: ['./modal-delivery-person.component.scss'],
})
export class ModalDeliveryPersonComponent implements OnInit, OnDestroy {

  public loading: boolean;

  public submitAttempt: boolean;

  public blob: Blob;

  public deliveryPerson: any;

  public formGroup: FormGroup;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private deliveryPersonSrv: DeliveryPersonService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      name: [this.deliveryPerson ? this.deliveryPerson.name : '', Validators.required],
      additional_information: [this.deliveryPerson?.additional_information ? this.deliveryPerson.additional_information : '']
    });

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

  public changeImage(event: any) {
    this.blob = event;
  }

  public save() {

    this.submitAttempt = true;

    if (this.formGroup.valid) {

      const formData = new FormData();

      formData.append('name', this.formControl.name.value);

      if (this.formControl.additional_information.value.length > 0) {
        formData.append('additional_information', this.formControl.additional_information.value);
      }

      if (this.blob) {
        formData.append('image', this.blob);
      }

      this.loading = true;

      if (this.deliveryPerson) {

        this.deliveryPersonSrv.update(this.deliveryPerson.id, formData)
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

        this.deliveryPersonSrv.create(formData)
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

}
