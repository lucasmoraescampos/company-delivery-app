import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert-success',
  templateUrl: './alert-success.page.html',
  styleUrls: ['./alert-success.page.scss'],
})
export class AlertSuccessPage {

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
