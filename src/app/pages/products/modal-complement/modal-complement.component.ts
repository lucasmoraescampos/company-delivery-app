import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-complement',
  templateUrl: './modal-complement.component.html',
  styleUrls: ['./modal-complement.component.scss'],
})
export class ModalComplementComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }
  
}
