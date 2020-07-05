import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-alert-location',
  templateUrl: './alert-location.page.html',
  styleUrls: ['./alert-location.page.scss'],
})
export class AlertLocationPage {

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {}

}
