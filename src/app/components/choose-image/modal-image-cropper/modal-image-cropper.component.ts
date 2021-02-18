import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-modal-image-cropper',
  templateUrl: './modal-image-cropper.component.html',
  styleUrls: ['./modal-image-cropper.component.scss'],
})
export class ModalImageCropperComponent implements OnInit {

  public loading: boolean;

  public image: any;

  public aspectRatio: number;

  public roundCropper: boolean;

  public croppedImage: any;

  public transform: ImageTransform = {
    scale: 1
  }

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {

    this.image = this.navParams.get('image');

    this.aspectRatio = this.navParams.get('aspectRatio');

    this.roundCropper = this.navParams.get('roundCropper');

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  public zoom(event: CustomEvent) {
    this.transform = {
      scale: event.detail.value
    }
  }

  public imageLoaded() {
    this.loading = true;
  }

  public cropperReady() {
    this.loading = false;
  }

  public crop() {
    this.modalCtrl.dismiss(this.croppedImage);
  }

}
