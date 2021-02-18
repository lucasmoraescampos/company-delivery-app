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

  public options: any = {
    initialSlide: 0
  }

  public loading: boolean;

  public blob: Blob;

  public map: any;

  public latLng: any;

  public search: string;

  public addresses: any[];

  public submitAttempt1: boolean;

  public submitAttempt2: boolean;

  public submitAttempt3: boolean;

  public formGroup1: FormGroup;

  public formGroup2: FormGroup;

  public formGroup3: FormGroup;

  public states: any[];

  public cities: any[];

  public paymentMethods: any[] = [];

  public onlinePaymentFee: number;

  private marker: any;

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
      phone: ['', [Validators.required, Validators.minLength(14)]],
      document_number: ['', Validators.required]
    });

    this.formGroup2 = this.formBuilder.group({
      postal_code: ['', Validators.required],
      street_name: ['', Validators.required],
      street_number: ['', Validators.required],
      district: ['', Validators.required],
      uf: ['', Validators.required],
      city: ['', Validators.required]
    });

    this.formGroup3 = this.formBuilder.group({
      allow_payment_online: [false, Validators.required],
      allow_payment_delivery: [false, Validators.required],
      allow_withdrawal_local: [false, Validators.required],
      min_order_value: ['0,00', Validators.required],
      waiting_time: ['', Validators.required],
      delivery_price: ['0,00', Validators.required],
      radius: ['', Validators.required]
    });

    this.prepareStates();

    this.prepareOnlinePaymentFee();

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
    this.alertSrv.show({
      icon: 'warning',
      message: 'Todos os dados informados serão esquecidos se você sair. Deseja sair?',
      confirmButtonText: 'Sair',
      onConfirm: () => {
        this.modalCtrl.dismiss();
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
        message: `Uma taxa de ${UtilsHelper.numberToMoney(this.onlinePaymentFee)}% será cobrada por cada pedido pago online.`,
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

      if (this.formGroup1.valid && this.blob) {
        this.slides.slideNext();
      }

    }

    if (this.slideActiveIndex == 1 && this.latLng) {
        this.slides.slideNext();
    }

    if (this.slideActiveIndex == 2) {

      this.submitAttempt2 = true;

      if (this.formGroup2.valid) {
        this.slides.slideNext();
      }

    }

    if (this.slideActiveIndex == 3) {

      this.submitAttempt3 = true;

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
        formData.append('allow_payment_online', allow_payment_online);
        formData.append('allow_payment_delivery', allow_payment_delivery);
        formData.append('allow_withdrawal_local', allow_withdrawal_local);
        formData.append('min_order_value', String(min_order_value));
        formData.append('waiting_time', this.formControl3.waiting_time.value);
        formData.append('delivery_price', String(delivery_price));
        formData.append('radius', this.formControl3.radius.value);
        formData.append('image', this.blob);

        this.paymentMethods.forEach(element => {
          formData.append('payment_methods[]', element);
        });

        this.companySrv.create(formData)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

            if (res.success) {

              this.alertSrv.toast({
                icon: 'success',
                message: 'Restaurante cadastrado com sucesso'
              });

              this.modalCtrl.dismiss(res.data);

            }

          });

      }

    }

  }

  public previous() {
    this.slides.slidePrev();
  }

  public changeImage(event: any) {
    this.blob = event;
  }

  public slideChanged() {

    this.slides.getActiveIndex().then((index: number) => {

      this.slideActiveIndex = index;

      if (index == 1 && this.map == undefined) {

        this.loadMap();

      }

    });

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

      this.loading = false;

      this.marker.addListener('dragend', (data: any) => {

        this.latLng = {
          lat: data.latLng.lat(),
          lng: data.latLng.lng()
        };

        this.map.setCenter(this.latLng);

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

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: address }, (geocode: any) => {

      geocode = Array.isArray(geocode) ? geocode[0] : geocode;

      this.latLng = {
        lat: geocode.geometry.location.lat(),
        lng: geocode.geometry.location.lng()
      }

      this.marker.setPosition(this.latLng);

      this.map.setCenter(this.latLng);

    });

  }

  public async locate() {

    const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });

    this.latLng = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };

    this.marker.setPosition(this.latLng);

    this.map.setCenter(this.latLng);

  }

  public changeUF(data: any) {

    this.loading = true;

    this.formGroup2.patchValue({ uf: data.uf });

    this.apiSrv.getCities(data.uf)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.cities = res.data;

        this.loading = false;

      });

  }

  public changeCity(data: any) {

    this.formGroup2.patchValue({ city: data.name });

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

  private prepareOnlinePaymentFee() {
    this.loading = true;
    this.apiSrv.getOnlinePaymentFee()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        this.onlinePaymentFee = res.data;
      });
  }

  private prepareStates() {
    this.loading = true;
    this.apiSrv.getStates()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.states = res.data
        this.loading = false;
      });
  }

}
