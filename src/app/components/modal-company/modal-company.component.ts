import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, NavParams } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { AlertService } from 'src/app/services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { takeUntil } from 'rxjs/operators';
import { ModalPaymentMethodsComponent } from '../modal-payment-methods/modal-payment-methods.component';
import { CompanyService } from 'src/app/services/company.service';
import { ArrayHelper } from 'src/app/helpers/array.helper';

const { Geolocation } = Plugins;

declare const google: any;

@Component({
  selector: 'app-modal-company',
  templateUrl: './modal-company.component.html',
  styleUrls: ['./modal-company.component.scss'],
})
export class ModalCompanyComponent implements OnInit, OnDestroy {

  @ViewChild('map', { static: true }) mapElement: ElementRef;

  @ViewChild(IonSlides) slides: IonSlides;

  public slideActiveIndex: number = 0;

  public loading: boolean;

  public company: any;

  public blobImage: Blob;

  public blobBanner: Blob;

  public search: string;

  public addresses: any[];

  public submitAttempt1: boolean;

  public submitAttempt2: boolean;

  public submitAttempt3: boolean;

  public formGroup1: FormGroup;

  public formGroup2: FormGroup;

  public formGroup3: FormGroup;

  public paymentMethods: any[] = [];

  public categories: any[];

  public plans: any[];

  public selectedPlan: any;

  private latLng: any;

  private marker: any;

  private map: any;

  private geocoder = new google.maps.Geocoder();

  private infoWindow = new google.maps.InfoWindow();

  private googleAutocomplete = new google.maps.places.AutocompleteService();

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private ngZone: NgZone,
    private modalCtrl: ModalController,
    private alertSrv: AlertService,
    private formBuilder: FormBuilder,
    private apiSrv: ApiService,
    private companySrv: CompanyService,
    private navParams: NavParams
  ) { }

  ngOnInit() {

    this.company = this.navParams.get('company');

    this.formGroup1 = this.formBuilder.group({
      name: [this.company?.name ?? '', Validators.required],
      category_id: [null, Validators.required],
      phone: [this.company?.phone ?? '', [Validators.required, Validators.minLength(14)]],
      document_number: [this.company?.document_number ?? '', Validators.required]
    });

    this.formGroup2 = this.formBuilder.group({
      postal_code: ['', Validators.required],
      street_name: [this.company?.street_name ?? '', Validators.required],
      street_number: [this.company?.street_number ?? '', Validators.required],
      district: [this.company?.district ?? '', Validators.required],
      uf: ['', Validators.required],
      city: ['', Validators.required],
      complement: [this.company?.complement ?? '']
    });

    this.formGroup3 = this.formBuilder.group({
      allow_payment_online: [this.company?.allow_payment_online ?? false, Validators.required],
      allow_payment_delivery: [this.company?.allow_payment_delivery ?? false, Validators.required],
      allow_withdrawal_local: [this.company?.allow_withdrawal_local ?? false, Validators.required],
      min_order_value: [this.company ? UtilsHelper.numberToMoney(this.company.min_order_value) : '', Validators.required],
      waiting_time: [String(this.company?.waiting_time) ?? '', Validators.required],
      delivery_price: [this.company ? UtilsHelper.numberToMoney(this.company.delivery_price) : '' ?? '', Validators.required],
      radius: [this.company ? String(this.company?.radius) : 0, Validators.required]
    });

    this.initCategories();

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  ionViewDidEnter() {
    this.slides.update();
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

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public changeCategory() {
    this.loading = true;
    this.apiSrv.getPlans(this.formControl1.category_id.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loading = false;

        this.plans = res.data
        
        if (this.company && this.company.category_id == this.formControl1.category_id.value) {

          const index = ArrayHelper.getIndexByKey(this.plans, 'id', this.company.plan_id);

          this.selectedPlan = this.plans[index];

        }

      });
  }

  public checkDocumentNumber() {

    if (this.formControl1.document_number.value.length == 0) return;

    this.formControl1.document_number.setErrors(null);

    if (!UtilsHelper.validateDocumentNumber(this.formControl1.document_number.value)) {

      this.formControl1.document_number.setErrors({ document_number: true });

    }

  }

  public checkWaitingTime() {

    if (this.formControl3.waiting_time.value.length == 0) return;

    this.formControl3.waiting_time.setErrors(null);

    const waiting_time = Number(this.formControl3.waiting_time.value);

    if (waiting_time == 0) {

      this.formControl3.waiting_time.setErrors({ zero: true });

    }

  }

  public checkRadius() {

    if (this.formControl3.radius.value.length == 0) return;

    this.formControl3.radius.setErrors(null);

    const radius = Number(this.formControl3.radius.value);

    if (radius == 0) {

      this.formControl3.radius.setErrors({ zero: true });

    }

  }

  public checkAllowPaymentOnline() {

    if (this.formControl3.allow_payment_online.value) {

      this.alertSrv.show({
        icon: 'warning',
        message: `Uma taxa de ${Number(this.selectedPlan.online_payment_fee)}% será cobrada por cada pagamento online.`,
        onConfirm: () => {
          this.formGroup3.patchValue({ allow_payment_online: true });
        },
        onCancel: () => {
          this.formGroup3.patchValue({ allow_payment_online: false });
        }
      });

    }

  }

  public next() {

    if (this.slideActiveIndex == 0) {

      this.submitAttempt1 = true;

      if (this.formGroup1.valid && (this.blobImage || this.company)) {

        if (this.map == undefined) {
          this.loadMap();
        }

        this.slideActiveIndex++;

        this.slides.slideNext();

      }

    }

    else if (this.slideActiveIndex == 1) {

      this.slideActiveIndex++;

      this.slides.slideNext();

    }

    else if (this.slideActiveIndex == 2) {

      this.submitAttempt2 = true;

      if (this.formGroup2.valid) {

        this.slideActiveIndex++;

        this.slides.slideNext();

      }

    }

    else if (this.slideActiveIndex == 3 && this.selectedPlan !== undefined) {

      this.slideActiveIndex++;

      this.slides.slideNext();

    }

    else if (this.slideActiveIndex == 4) {

      this.submitAttempt3 = true;

      this.checkRadius();

      if (this.formGroup3.valid) {

        this.loading = true;

        const phone = this.formControl1.phone.value.replace(/[^0-9]/g, '');

        const document_number = this.formControl1.document_number.value.replace(/[^0-9]/g, '');

        const postal_code = this.formControl2.postal_code.value.replace(/[^0-9]/g, '');

        const min_order_value = UtilsHelper.moneyToNumber(this.formControl3.min_order_value.value);

        const delivery_price = UtilsHelper.moneyToNumber(this.formControl3.delivery_price.value);

        const allow_payment_online = this.formControl3.allow_payment_online.value == true ? '1' : '0';

        const allow_payment_delivery = this.formControl3.allow_payment_delivery.value == true ? '1' : '0';

        const allow_withdrawal_local = this.formControl3.allow_withdrawal_local.value == true ? '1' : '0';

        const formData = new FormData();

        formData.append('name', this.formControl1.name.value);
        formData.append('category_id', this.formControl1.category_id.value);
        formData.append('phone', phone);
        formData.append('document_number', document_number);
        formData.append('latitude', this.latLng.lat);
        formData.append('longitude', this.latLng.lng);
        formData.append('postal_code', postal_code);
        formData.append('street_name', this.formControl2.street_name.value);
        formData.append('street_number', this.formControl2.street_number.value);
        formData.append('district', this.formControl2.district.value);
        formData.append('uf', this.formControl2.uf.value);
        formData.append('city', this.formControl2.city.value);
        formData.append('plan_id', this.selectedPlan.id);
        formData.append('allow_payment_online', allow_payment_online);
        formData.append('allow_payment_delivery', allow_payment_delivery);
        formData.append('allow_withdrawal_local', allow_withdrawal_local);
        formData.append('min_order_value', String(min_order_value));
        formData.append('waiting_time', this.formControl3.waiting_time.value);
        formData.append('delivery_price', String(delivery_price));
        formData.append('radius', this.formControl3.radius.value);

        if (this.blobImage) {
          formData.append('image', this.blobImage);
        }
        
        if (this.blobBanner) {
          formData.append('banner', this.blobBanner);
        }

        if (this.formControl2.complement.value.length > 0) {
          formData.append('complement', this.formControl2.complement.value);
        }

        this.paymentMethods.forEach(element => {
          formData.append('payment_methods[]', element);
        });

        if (this.company) {

          this.companySrv.update(this.company.id, formData)
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

          this.companySrv.create(formData)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(res => {

              this.loading = false;

              if (res.success) {

                this.alertSrv.show({
                  icon: 'success',
                  message: 'Pronto! Sua empresa está sendo analisada por nossa equipe, e um de nossos consultores entrará em contato com você para finalizar o cadastro.',
                  showCancelButton: false,
                  confirmButtonText: 'Entendi'
                });

                this.modalCtrl.dismiss(res.data);

              }

            });

        }

      }

    }

  }

  public previous() {
    this.slideActiveIndex--;
    this.slides.slidePrev();
  }

  public changeImage(event: any) {
    this.blobImage = event;
  }

  public changeBanner(event: any) {
    this.blobBanner = event;
  }

  public async loadMap() {

    this.loading = true;

    try {

      if (this.company) {

        this.latLng = {
          lat: Number(this.company.latitude),
          lng: Number(this.company.longitude)
        };

      }

      else {

        const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });

        this.latLng = {
          lat: coordinates.coords.latitude,
          lng: coordinates.coords.longitude
        };

      }

      const mapOptions = {
        center: this.latLng,
        zoom: 18,
        zoomControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.marker = new google.maps.Marker({
        map: this.map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: this.latLng
      });

      this.geocodeLatLng(this.latLng);

      this.marker.addListener('dragend', (data: any) => {

        this.latLng = {
          lat: data.latLng.lat(),
          lng: data.latLng.lng()
        };

        this.map.setCenter(this.latLng);

        this.geocodeLatLng(this.latLng);

      });

    } catch (error) {

      this.alertSrv.show({
        icon: 'error',
        message: 'Não foi possível obter localização, verifique se o seu GPS está ativado ou se o sistema possui permissão para acessar sua localização.',
        showCancelButton: false,
        onConfirm: () => {
          this.modalCtrl.dismiss();
        }
      });

    }

  }

  public searchChanged() {

    if (this.search.trim().length < 3) {

      this.addresses = [];

    }

    else {

      const latLng = new google.maps.LatLng(this.latLng);

      this.googleAutocomplete.getPlacePredictions({
        input: this.search,
        location: latLng,
        radius: 10000
      }, (predictions: any) => {

        this.ngZone.run(() => {

          this.addresses = [];

          predictions.forEach((prediction: any) => {

            this.addresses.push(prediction.description);

          });

        });

      });

    }

  }

  public selectAddress(address: string) {

    this.search = address;

    this.addresses = [];

    this.geocodeAddress(address);

  }

  public async locate() {

    const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });

    this.latLng = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };

    this.marker.setPosition(this.latLng);

    this.map.setCenter(this.latLng);

    this.geocodeLatLng(this.latLng);

  }

  public async modalPaymentMethods() {

    if (this.formControl3.allow_payment_delivery.value) {

      const modal = await this.modalCtrl.create({
        component: ModalPaymentMethodsComponent,
        backdropDismiss: false,
        cssClass: 'modal-sm',
        componentProps: {
          company: this.company
        }
      });

      modal.onWillDismiss()
        .then(res => {
          if (res.data) {
            this.paymentMethods = res.data;
          }
          else {
            this.paymentMethods = [];
            this.formGroup3.patchValue({ allow_payment_delivery: false });
          }
        });

      return await modal.present();

    }

  }

  private geocodeLatLng(latLng: any) {

    this.loading = true;

    this.geocoder.geocode({ location: latLng }, (results: any) => {

      this.loading = false;

      this.serializeAddress(results[0].address_components);

      setTimeout(() => {

        this.infoWindow.setContent(results[0].formatted_address);

        this.infoWindow.open(this.map, this.marker);

      }, 500);

    });

  }

  private geocodeAddress(address: any) {

    this.loading = true;

    this.geocoder.geocode({ address: address }, (results: any) => {

      this.loading = false;

      this.latLng = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng()
      }

      this.marker.setPosition(this.latLng);

      this.map.setCenter(this.latLng);

      this.serializeAddress(results[0].address_components);

      setTimeout(() => {

        this.infoWindow.setContent(results[0].formatted_address);

        this.infoWindow.open(this.map, this.marker);

      }, 500);

    });

  }

  private serializeAddress(address_components: any[]) {

    address_components.forEach((component: any) => {

      if (component.types.indexOf('street_number') != -1) {

        if (!this.company) {

          this.formGroup2.patchValue({ street_number: component.long_name });

        }

      }

      else if (component.types.indexOf('route') != -1) {

        if (!this.company) {

          this.formGroup2.patchValue({ street_name: component.long_name });

        }

      }

      else if (component.types.indexOf('sublocality_level_1') != -1) {

        if (!this.company) {

          this.formGroup2.patchValue({ district: component.long_name });

        }

      }

      else if (component.types.indexOf('administrative_area_level_2') != -1) {

        this.formGroup2.patchValue({ city: component.long_name });

      }

      else if (component.types.indexOf('administrative_area_level_1') != -1) {

        this.formGroup2.patchValue({ uf: component.short_name });

      }

      else if (component.types.indexOf('country') != -1) {

      }

      else if (component.types.indexOf('postal_code') != -1) {

        this.formGroup2.patchValue({ postal_code: component.short_name });

      }

    });

  }

  private initCategories() {
    this.loading = true;
    this.apiSrv.getCategories()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        this.categories = res.data
        if (this.company) {
          this.formGroup1.patchValue({ category_id: this.company.category_id});
        }
      });
  }

}
