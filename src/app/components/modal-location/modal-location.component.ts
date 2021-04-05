import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { CompanyService } from 'src/app/services/company.service';

const { Geolocation } = Plugins;

declare const google: any;

@Component({
  selector: 'app-modal-location',
  templateUrl: './modal-location.component.html',
  styleUrls: ['./modal-location.component.scss'],
})
export class ModalLocationComponent implements OnInit, OnDestroy {

  @ViewChild(IonSlides) slides: IonSlides;

  @ViewChild('map', { static: true }) mapElement: ElementRef;

  public loading: boolean;

  public submitAttempt: boolean;

  public company: any;

  public search: string;

  public slideActiveIndex: number = 0;

  public formGroup: FormGroup;

  private latLng: any;

  private marker: any;

  private map: any;

  private geocoder = new google.maps.Geocoder();

  private infoWindow = new google.maps.InfoWindow();

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private companySrv: CompanyService,
    private alertSrv: AlertService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.company = this.companySrv.getCurrentCompany();

    this.latLng = new google.maps.LatLng(this.company.latitude, this.company.longitude);

    this.formGroup = this.formBuilder.group({
      postal_code: [this.company.postal_code, Validators.required],
      street_name: [this.company.street_name, Validators.required],
      street_number: [this.company.street_number, Validators.required],
      district: [this.company.district, Validators.required],
      uf: [this.company.uf, Validators.required],
      city: [this.company.city, Validators.required],
      complement: [this.company.complement]
    });

    this.initMap();

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

  public previous() {
    this.slideActiveIndex = 0;
    this.slides.slidePrev();
  }

  public next() {
    this.slideActiveIndex = 1;
    this.slides.slideNext();
  }

  public async locate() {

    const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });

    this.latLng = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);

    this.marker.setPosition(this.latLng);

    this.map.setCenter(this.latLng);

    this.geocodeLatLng(this.latLng);

  }

  public save() {

    this.submitAttempt = true;

    if (this.formGroup.valid) {

      this.loading = true;

      const latitude = this.latLng.lat();

      const longitude = this.latLng.lng();

      const data: any = {
        latitude: String(latitude),
        longitude: String(longitude),
        postal_code: this.formControl.postal_code.value.replace(/[^0-9]/g, ''),
        street_name: this.formControl.street_name.value,
        street_number: this.formControl.street_number.value,
        district: this.formControl.district.value,
        uf: this.formControl.uf.value,
        city: this.formControl.city.value,
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

  private async initMap() {

    this.loading = true;

    try {

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

        this.latLng = new google.maps.LatLng(data.latLng.lat(), data.latLng.lng());

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
          this.dismiss();
        }
      });

    }

  }

  private geocodeLatLng(latLng: any) {

    this.loading = true;

    this.geocoder.geocode({ location: latLng }, (results: any) => {

      this.loading = false;

      results[0].address_components.forEach((component: any) => {
        if (component.types.indexOf('street_number') != -1) {
          this.formGroup.patchValue({ street_number: component.long_name });
        }
        else if (component.types.indexOf('route') != -1) {
          this.formGroup.patchValue({ street_name: component.long_name });
        }
        else if (component.types.indexOf('sublocality_level_1') != -1) {
          this.formGroup.patchValue({ district: component.long_name });
        }
        else if (component.types.indexOf('administrative_area_level_2') != -1) {
          this.formGroup.patchValue({ city: component.long_name });
        }
        else if (component.types.indexOf('administrative_area_level_1') != -1) {
          this.formGroup.patchValue({ uf: component.short_name });
        }
        else if (component.types.indexOf('postal_code') != -1) {
          this.formGroup.patchValue({ postal_code: component.short_name });
        }
      });

      setTimeout(() => {

        this.infoWindow.setContent(results[0].formatted_address);

        this.infoWindow.open(this.map, this.marker);

      }, 500);

    });

  }

}
