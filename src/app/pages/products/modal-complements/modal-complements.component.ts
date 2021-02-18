import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalComplementComponent } from '../modal-complement/modal-complement.component';

@Component({
  selector: 'app-modal-complements',
  templateUrl: './modal-complements.component.html',
  styleUrls: ['./modal-complements.component.scss'],
})
export class ModalComplementsComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public async modalComplement() {

    const modal = await this.modalCtrl.create({
      component: ModalComplementComponent,
      backdropDismiss: false,
      cssClass: 'modal-sm'
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data) {

        }

      });

    return await modal.present();

  }

}
