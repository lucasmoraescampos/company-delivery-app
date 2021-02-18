import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { AttendantService } from 'src/app/services/attendant.service';

@Component({
  selector: 'app-modal-attendant',
  templateUrl: './modal-attendant.component.html',
  styleUrls: ['./modal-attendant.component.scss'],
})
export class ModalAttendantComponent implements OnInit, OnDestroy {

  public loading: boolean;

  public submitAttempt: boolean;

  public blob: Blob;

  public attendant: any;

  public formGroup: FormGroup;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private attendantSrv: AttendantService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      name: [this.attendant ? this.attendant.name : '', Validators.required],
      additional_information: [this.attendant?.additional_information ? this.attendant.additional_information : '']
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

      if (this.attendant) {

        this.attendantSrv.update(this.attendant.id, formData)
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

        this.attendantSrv.create(formData)
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
