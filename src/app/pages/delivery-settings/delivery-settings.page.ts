import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';

@Component({
  selector: 'app-delivery-settings',
  templateUrl: './delivery-settings.page.html',
  styleUrls: ['./delivery-settings.page.scss'],
})
export class DeliverySettingsPage implements OnInit {

  public formGroupSettings: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private toastSrv: ToastService
  ) { }

  ngOnInit() {

    this.formGroupSettings = this.formBuilder.group({
      waiting_time: [null, Validators.required],
      min_value: ['0.00', Validators.required]
    });

  }

  public next() {

    if (this.formGroupSettings.valid) {

      localStorage.setItem(ConfigHelper.Storage.Setup.Delivery, JSON.stringify(this.formGroupSettings.value));

      this.navCtrl.navigateForward('/payment-methods');

    }

    else {

      this.toastSrv.error('Informe todos os dados!');

    }

  }
}
