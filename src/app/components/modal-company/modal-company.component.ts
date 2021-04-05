import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
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
import { environment } from 'src/environments/environment';

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

  readonly bannerDefault = environment.imagesUrl + '/banner.png';

  public slideActiveIndex: number = 0;

  public loading: boolean;

  public uploadedImage: string;

  public uploadedBanner: string;

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
    private companySrv: CompanyService
  ) { }

  ngOnInit() {

    this.formGroup1 = this.formBuilder.group({
      name: ['', Validators.required],
      category_id: [null, Validators.required],
      phone: ['', [Validators.required, Validators.minLength(14)]],
      document_number: ['', Validators.required]
    });

    this.formGroup2 = this.formBuilder.group({
      postal_code: ['', Validators.required],
      street_name: ['', Validators.required],
      street_number: ['', Validators.required],
      district: ['', Validators.required],
      uf: ['', Validators.required],
      city: ['', Validators.required],
      complement: ['']
    });

    this.formGroup3 = this.formBuilder.group({
      allow_payment_online: [false, Validators.required],
      allow_payment_delivery: [false, Validators.required],
      allow_withdrawal_local: [false, Validators.required],
      min_order_value: ['', Validators.required],
      waiting_time: ['', Validators.required],
      delivery_price: ['', Validators.required],
      radius: [0, Validators.required]
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

      if (this.formGroup1.valid && this.uploadedImage) {

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

        const data: any = {
          name: this.formControl1.name.value,
          category_id: this.formControl1.category_id.value,
          phone: this.formControl1.phone.value.replace(/[^0-9]/g, ''),
          document_number: this.formControl1.document_number.value.replace(/[^0-9]/g, ''),
          latitude: String(this.latLng.lat),
          longitude: String(this.latLng.lng),
          postal_code: this.formControl2.postal_code.value.replace(/[^0-9]/g, ''),
          street_name: this.formControl2.street_name.value,
          street_number: this.formControl2.street_number.value,
          district: this.formControl2.district.value,
          uf: this.formControl2.uf.value,
          city: this.formControl2.city.value,
          plan_id: this.selectedPlan.id,
          allow_payment_online: this.formControl3.allow_payment_online.value,
          allow_payment_delivery: this.formControl3.allow_payment_delivery.value,
          allow_withdrawal_local: this.formControl3.allow_withdrawal_local.value,
          min_order_value: UtilsHelper.moneyToNumber(this.formControl3.min_order_value.value),
          waiting_time: this.formControl3.waiting_time.value,
          delivery_price: UtilsHelper.moneyToNumber(this.formControl3.delivery_price.value),
          radius: this.formControl3.radius.value,
        }

        if (this.uploadedImage) {
          data.image = this.uploadedImage;
        }

        if (this.uploadedBanner) {
          data.banner = this.uploadedBanner;
        }

        if (this.formControl2.complement.value.length > 0) {
          data.complement = this.formControl2.complement.value;
        }

        if (this.paymentMethods.length > 0) {
          data.payment_methods = this.paymentMethods;
        }

        this.companySrv.create(data)
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

  public previous() {
    this.slideActiveIndex--;
    this.slides.slidePrev();
  }

  public changeImage(dataUrl: string) {
    this.uploadedImage = dataUrl;
  }

  public changeBanner(dataUrl: string) {
    this.uploadedBanner = dataUrl;
  }

  public async loadMap() {

    this.loading = true;

    try {

      const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });

      this.latLng = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };

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
        confirmButtonText: 'Entendi',
        showCancelButton: false,
        onConfirm: () => {
          this.loading = false;
          this.previous();
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
        cssClass: 'modal-sm'
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
        this.formGroup2.patchValue({ street_number: component.long_name });
      }
      else if (component.types.indexOf('route') != -1) {
        this.formGroup2.patchValue({ street_name: component.long_name });
      }
      else if (component.types.indexOf('sublocality_level_1') != -1) {
        this.formGroup2.patchValue({ district: component.long_name });
      }
      else if (component.types.indexOf('administrative_area_level_2') != -1) {
        this.formGroup2.patchValue({ city: component.long_name });
      }
      else if (component.types.indexOf('administrative_area_level_1') != -1) {
        this.formGroup2.patchValue({ uf: component.short_name });
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
      });
  }

}
