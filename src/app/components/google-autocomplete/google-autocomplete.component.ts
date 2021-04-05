import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;

declare const google: any;

@Component({
  selector: 'app-google-autocomplete',
  templateUrl: './google-autocomplete.component.html',
  styleUrls: ['./google-autocomplete.component.scss'],
})
export class GoogleAutocompleteComponent implements OnInit {

  @Output() changeAddress = new EventEmitter();

  public loading: boolean;

  public search: string;

  public addressList: any[];

  public enableList: boolean = false;

  public latLng: any;

  private googleAutocomplete = new google.maps.places.AutocompleteService();

  private geocoder = new google.maps.Geocoder();

  constructor(
    private ngZone: NgZone
  ) { }

  ngOnInit() {

    this.initLatLng();
    
  }

  public searchChanged() {

    if (this.search.trim().length < 3) {

      this.addressList = [];

    }

    else {

      this.googleAutocomplete.getPlacePredictions({
        input: this.search,
        location: this.latLng,
        radius: 10000
      }, (predictions: any) => {

        this.ngZone.run(() => {

          this.addressList = [];

          predictions.forEach((prediction: any) => {

            this.addressList.push(prediction.description);

          });

        });

      });

    }

  }

  public selectAddress(address: string) {

    this.search = address;

    this.addressList = [];

    this.geocoder.geocode({ address: address }, (results: any) => {

      this.changeAddress.emit({
        address: address,
        latLng: {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        }
      });

    });

  }

  private async initLatLng() {
    const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    this.latLng = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);
  }

}
