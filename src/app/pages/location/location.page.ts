import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { LatLng } from 'src/app/models/LatLng';
import { AddressComponents } from 'src/app/models/AddressComponents';
import { ModalController } from '@ionic/angular';
import { AddressPage } from '../modal/address/address.page';
import { Geolocation } from '@capacitor/core';
import { LoadingService } from 'src/app/services/loading/loading.service';

declare var google: any;

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  @ViewChild('map', { static: true }) mapElement: any;

  public search: string;

  public searchResults: Array<any> = [];

  public title: string;

  public subtitle: string;

  private map: any;

  private marker: any;

  private googleAutocomplete = new google.maps.places.AutocompleteService();

  private latLng: LatLng;

  private address_components: AddressComponents;

  private no_search: boolean = false;

  constructor(
    private ngZone: NgZone,
    private modalCtrl: ModalController,
    private loadingSrv: LoadingService
  ) { }

  ngOnInit() {

    this.mapElement = this.mapElement.nativeElement;

    this.init();

  }

  public async continue() {

    const modal = await this.modalCtrl.create({
      component: AddressPage,
      cssClass: 'modal-custom',
      componentProps: {
        address: this.address_components,
        latLng: this.latLng
      }
    });

    return await modal.present();

  }

  public searchChanged() {

    if (this.search.trim().length < 3 || this.no_search) return;

    const latLng = new google.maps.LatLng(this.latLng);

    this.googleAutocomplete.getPlacePredictions({
      input: this.search,
      location: latLng,
      radius: 10000
    }, (predictions: any) => {

      this.ngZone.run(() => {

        this.searchResults = [];

        if (predictions != null) {

          this.searchResults = [];

          predictions.forEach((prediction: any) => {

            this.searchResults.push(prediction.description);

          });

        }

      });
    });

  }

  public selectLocation(address: string) {

    this.loadingSrv.show();

    this.no_search = true;

    this.searchResults = [];

    this.search = address;

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: address }, (geocode: any) => {

      geocode = Array.isArray(geocode) ? geocode[0] : geocode;

      const address_components: any = {};

      geocode.address_components.forEach((component: any) => {

        component.types.forEach((type: string) => {

          switch (type) {

            case 'sublocality_level_1':

              address_components.district = component.long_name;

              break;

            case 'street_number':

              address_components.street_number = component.long_name;

              break;

            case 'route':

              address_components.street_name = component.long_name;

              break;

            case 'administrative_area_level_2':

              address_components.city = component.long_name;

              break;

            case 'administrative_area_level_1':

              address_components.uf = component.short_name;

              break;

            case 'country':

              address_components.country = component.long_name;

              break;

            case 'postal_code':

              address_components.postal_code = component.long_name;

              break;

          }

        });

      });

      this.address_components = address_components;

      this.loadHeaderLocation();

      const latLng = {
        lat: geocode.geometry.location.lat(),
        lng: geocode.geometry.location.lng()
      }

      this.marker.setPosition(latLng);

      this.map.setCenter(latLng);

      this.loadingSrv.hide();

      this.no_search = false;

    });

  }

  private async init() {

    this.loadingSrv.show();

    const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });

    this.latLng = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    this.loadMap();

    this.loadAddressComponent();

    this.loadingSrv.hide();
    
  }

  private loadMap() {

    this.loadingSrv.show();

    const mapOptions = {
      zoom: 18,
      center: this.latLng,
      zoomControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    };

    this.map = new google.maps.Map(this.mapElement, mapOptions);

    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: this.latLng
    });

    this.marker.addListener('dragend', (data: any) => {

      this.search = '';

      this.latLng = {
        lat: data.latLng.lat(),
        lng: data.latLng.lng()
      };

      this.map.setZoom(18);

      this.map.setCenter(this.latLng);

      this.loadAddressComponent();

    });

    this.loadingSrv.hide();

  }

  private loadAddressComponent() {

    this.loadingSrv.show();

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: this.latLng }, (geocode: any) => {

      geocode = Array.isArray(geocode) ? geocode[0] : geocode;

      const address_components: any = {};

      geocode.address_components.forEach((component: any) => {

        component.types.forEach((type: string) => {

          switch (type) {

            case 'sublocality_level_1':

              address_components.district = component.long_name;

              break;

            case 'street_number':

              address_components.street_number = component.long_name;

              break;

            case 'route':

              address_components.street_name = component.long_name;

              break;

            case 'administrative_area_level_2':

              address_components.city = component.long_name;

              break;

            case 'administrative_area_level_1':

              address_components.uf = component.short_name;

              break;

            case 'country':

              address_components.country = component.long_name;

              break;

            case 'postal_code':

              address_components.postal_code = component.long_name;

              break;

          }

        });

      });

      this.address_components = address_components;

      this.loadHeaderLocation();

      this.loadingSrv.hide();

    });

  }

  private loadHeaderLocation() {

    if (this.address_components.street_name != undefined) {

      this.title = this.address_components.street_name;
      this.title += this.address_components.street_number != undefined ? `, ${this.address_components.street_number}` : '';

      this.subtitle = `${this.address_components.city} - ${this.address_components.uf}, ${this.address_components.country}`;

    }

    else {

      this.title = `${this.address_components.city} - ${this.address_components.uf}`;

      this.subtitle = `${this.address_components.postal_code}, ${this.address_components.country}`;

    }

  }
}