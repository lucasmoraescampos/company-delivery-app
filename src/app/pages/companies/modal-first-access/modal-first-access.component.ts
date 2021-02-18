import { IonSlides, ModalController } from '@ionic/angular';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PlanService } from 'src/app/services/plan.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MercadoPagoService } from 'src/app/services/mercado-pago.service';
import { ValidatorsHelper } from 'src/app/helpers/validators.helper';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { LoadingService } from 'src/app/services/loading.service';
import { CardService } from 'src/app/services/card.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-modal-first-access',
  templateUrl: './modal-first-access.component.html',
  styleUrls: ['./modal-first-access.component.scss'],
})
export class ModalFirstAccessComponent implements OnInit, OnDestroy {

  @ViewChild(IonSlides) slides: IonSlides;

  public slideLength: number = 4;

  public slideActiveIndex: number = 0;

  public plans: any[];

  public selectedPlanIndex: number;

  public formGroupCard: FormGroup;

  public paymentMethod: any;

  public submitAttempt: boolean = false;

  public loading: boolean = false;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private planSrv: PlanService,
    private cardSrv: CardService,
    private formBuilder: FormBuilder,
    private mercadoPagoSrv: MercadoPagoService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.formGroupCard = this.formBuilder.group({
      number: ['', Validators.required],
      expiration: ['', Validators.required],
      security_code: ['', Validators.required],
      holder_name: ['', Validators.required],
      holder_document_number: ['', Validators.required]
    });

    this.preparePlans();

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  public get formControl() {
    return this.formGroupCard.controls;
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public next() {
    if (this.slideActiveIndex < this.slideLength - 1) {
      this.slideActiveIndex++;
    }
    this.slides.slideNext();
  }

  public previous() {
    if (this.slideActiveIndex > 0) {
      this.slideActiveIndex--;
    }
    this.slides.slidePrev();
  }

  public guessPaymentMethod() {

    const number = this.formControl.number.value.replace(/[^0-9]/g, '');

    if (number == 0) {

      this.paymentMethod = null;

    }

    this.mercadoPagoSrv.getPaymentMethod(number, (status: number, response: any) => {

      if (status == 200) {

        this.paymentMethod = response[0];

        this.formControl.number.setErrors(null);

      } else {

        this.formControl.number.setErrors({ cardNumber: true });

      }

    });

  }

  public checkExpiration() {

    if (this.formControl.expiration.value.length > 0) {

      if (this.formControl.expiration.value.length == 7) {

        this.formControl.expiration.setErrors(null);

      } else {

        this.formControl.expiration.setErrors({ cardExpiration: true });

      }

    }

  }

  public checkDocumentNumber() {

    if (this.formControl.holder_document_number.value.length > 0) {

      if (UtilsHelper.validateDocumentNumber(this.formControl.holder_document_number.value)) {

        this.formControl.holder_document_number.setErrors(null);

      }

      else {

        this.formControl.holder_document_number.setErrors({ documentNumber: true });

      }

    }
    
  }

  public pay() {

    this.submitAttempt = true;

    if (this.formGroupCard.valid) {

      const card_number = this.formControl.number.value.replace(/[^0-9]/g, '');

      const expiration = this.formControl.expiration.value.split('/');

      const document_number = this.formControl.holder_document_number.value.replace(/[^0-9]/g, '');

      const document_type = document_number.length == 11 ? 'CPF' : 'CNPJ';

      const card = {
        number: card_number,
        expiration_month: expiration[0],
        expiration_year: expiration[1],
        security_code: this.formControl.security_code.value,
        holder_name: this.formControl.holder_name.value,
        document_type: document_type,
        document_number: document_number
      }

      this.loading = true;

      this.mercadoPagoSrv.createToken(card, (status: number, response: any) => {

        if (status == 200 || status == 201) {

          const data = {
            card_token: response.id,
            payment_method_id: this.paymentMethod.id,
            plan_id: this.plans[this.selectedPlanIndex].id
          }

          this.planSrv.subscription(data)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(res => {

              if (res.success) {

                this.cardSrv.create(card)
                  .pipe(takeUntil(this.unsubscribe))
                  .subscribe(res => {

                    this.loading = false;

                    this.next();

                  });

              }

              else {

                this.loading = false;

                this.alertSrv.toast({
                  icon: 'error',
                  message: res.message
                });

              }

            });

        }

        else {

          this.loading = false;

          this.alertSrv.toast({
            icon: 'error',
            message: 'Dados incorretos do cartão de crédito'
          });

        }

      });

    }
    
  }
  private preparePlans() {
    this.planSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        if (res.success) {
          this.plans = res.data
        }
      });
  }
}
