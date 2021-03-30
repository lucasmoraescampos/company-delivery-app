import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { AlertService } from 'src/app/services/alert.service';
import { DeliverymanService } from 'src/app/services/deliveryman.service';

@Component({
  selector: 'app-modal-company-deliverymen-list',
  templateUrl: './modal-company-deliverymen-list.component.html',
  styleUrls: ['./modal-company-deliverymen-list.component.scss'],
})
export class ModalCompanyDeliverymenListComponent implements OnInit, OnDestroy {

  @ViewChild(IonSlides) slides: IonSlides;

  @Input() order: any;

  public loading: boolean;

  public slideActiveIndex: number = 0;

  public selectedDeliverymanIndex: number;

  public submitAttempt: boolean;

  public deliverymen: any[];

  public formGroup: FormGroup;

  private unsubscribe = new Subject();
  
  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private deliverymanSrv: DeliverymanService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(14)]]
    });

    this.initDeliverymen();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ionViewDidEnter() {
    this.slides.update();
  }

  public get formControl() {
    return this.formGroup.controls;
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public back() {
    this.slideActiveIndex = 0;
    this.slides.slidePrev();
  }
  
  public add() {
    this.submitAttempt = false;
    this.slideActiveIndex = 1;
    this.slides.slideNext();
  }

  public confirm() {
    this.modalCtrl.dismiss(this.deliverymen[this.selectedDeliverymanIndex]);
  }

  public save() {

    this.submitAttempt = true;

    if (this.formGroup.valid) {

      this.loading = true;

      const data = this.formGroup.value;

      data.phone = data.phone.replace(/[^0-9]/g, '');

      this.deliverymanSrv.create(data)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(res => {

          this.loading = false;

          if (res.success) {

            this.deliverymen.push(res.data);

            this.deliverymen = ArrayHelper.orderbyAsc(this.deliverymen, 'name');

            this.back();

          }

        });

    }

  }

  public delete(index: number) {

    const deliveryman = this.deliverymen[index];

    this.alertSrv.show({
      icon: 'warning',
      message: `${deliveryman.name} será excluído(a). Deseja continuar?`,
      confirmButtonText: 'Continuar',
      onConfirm: () => {

        this.loading = true;

        this.deliverymanSrv.delete(deliveryman.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

            if (res.success) {

              this.deliverymen = ArrayHelper.removeItem(this.deliverymen, index);

            }

          })

      }

    });

  }

  private initDeliverymen() {

    this.loading = true;

    this.deliverymanSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loading = false;

        this.deliverymen = res.data;

        if (this.order && this.order.company_deliveryman) {

          this.selectedDeliverymanIndex = ArrayHelper.getIndexByKey(this.deliverymen, 'id', this.order.company_deliveryman.id);
    
        }

      });
      
  }

}
