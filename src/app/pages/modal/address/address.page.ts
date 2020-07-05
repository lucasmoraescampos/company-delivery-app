import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

  public formGroupAddress: FormGroup;

  public address: any;

  public spinner: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private toastSrv: ToastService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {

    const address = this.navParams.get('address');

    const latLng = this.navParams.get('latLng');

    this.formGroupAddress = this.formBuilder.group({
      street_name: [address.street_name, Validators.required],
      street_number: [address.street_number, Validators.required],
      district: [address.district, Validators.required],
      city: [address.city, Validators.required],
      uf: [address.uf, Validators.required],
      country: [address.country, Validators.required],
      zipcode: [address.postal_code, Validators.required],
      latitude: [latLng.lat, Validators.required],
      longitude: [latLng.lng, Validators.required],
      complement: ['']
    });

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public save() {

    if (this.formGroupAddress.valid) {

      localStorage.setItem(ConfigHelper.Storage.Setup.Location, JSON.stringify(this.formGroupAddress.value));

      this.modalCtrl.dismiss();
      
      this.navCtrl.navigateForward('/delivery-settings');

    }

    else {

      this.toastSrv.error('Preencha todos os campos!');

    }

  }
}
