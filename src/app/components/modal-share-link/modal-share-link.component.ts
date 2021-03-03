import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-share-link',
  templateUrl: './modal-share-link.component.html',
  styleUrls: ['./modal-share-link.component.scss'],
})
export class ModalShareLinkComponent implements OnInit {

  public slug: string;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}
  
  public dismiss() {
    this.modalCtrl.dismiss();
  }

}
