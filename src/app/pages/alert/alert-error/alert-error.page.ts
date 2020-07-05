import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert-error',
  templateUrl: './alert-error.page.html',
  styleUrls: ['./alert-error.page.scss'],
})
export class AlertErrorPage {

  constructor(
    private modalCtrl: ModalController
  ) {

    setTimeout(() => {
      this.dismiss();
    }, 3500);

  }

  public dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
