import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CameraResultType, CameraSource, Capacitor, DeviceInfo, Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ModalImageCropperComponent } from './modal-image-cropper/modal-image-cropper.component';

const { Camera, Device } = Plugins;

@Component({
  selector: 'app-choose-image',
  templateUrl: './choose-image.component.html',
  styleUrls: ['./choose-image.component.scss'],
})
export class ChooseImageComponent implements OnInit {

  @Input() invalid: boolean = false;

  @Input() rounded: boolean = false;

  @Input() aspectRatio: number = 1 / 1;

  @Input() image: string = '';

  @Input() style: string = '';

  @Input() maxSize: number = 8000000;

  @Output() changeImage = new EventEmitter<string>();

  public loading: boolean;

  public blob: Blob;

  public webUseInput: boolean;

  constructor(
    private modalCtrl: ModalController,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    Device.getInfo().then(device => this.webUseInput = device.platform === 'web');

  }

  public async chooseImage() {

    const image = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
      webUseInput: this.webUseInput
    });

    const allowTypes = ['gif', 'png', 'jpeg', 'bmp', 'webp'];

    if (allowTypes.indexOf(image.format) == -1) {
      
      this.alertSrv.toast({
        icon: 'error',
        message: 'O arquivo enviado não é uma imagem'
      });

    }

    else if (image.dataUrl.length > this.maxSize) {
      
      this.alertSrv.toast({
        icon: 'error',
        message: 'A imagem enviada deve ter no máximo ' + (this.maxSize / 1000000) + 'MB'
      });

    }

    else {

      this.modalImageCropper(image.dataUrl);

    }

  }

  private async modalImageCropper(dataUrl: string) {

    this.loading = true;

    const modal = await this.modalCtrl.create({
      component: ModalImageCropperComponent,
      backdropDismiss: false,
      componentProps: {
        image: dataUrl,
        roundCropper: this.rounded,
        aspectRatio: this.aspectRatio
      }
    });

    modal.onWillDismiss()
      .then(res => {

        this.loading = false;

        if (res.data) {

          this.changeImage.emit(res.data);

        }

        else {

          this.blob = null;

        }

      });

    return await modal.present();

  }

}
