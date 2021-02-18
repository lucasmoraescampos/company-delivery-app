import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CameraResultType, CameraSource, DeviceInfo, Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { AlertService } from 'src/app/services/alert.service';
import { ModalImageCropperComponent } from './modal-image-cropper/modal-image-cropper.component';

const { Camera, Device } = Plugins;

@Component({
  selector: 'app-choose-image',
  templateUrl: './choose-image.component.html',
  styleUrls: ['./choose-image.component.scss'],
})
export class ChooseImageComponent implements OnInit {

  @ViewChild('inputfile', { static: true }) inputfile: ElementRef;

  @Input() invalid: boolean = false;

  @Input() rounded: boolean = false;

  @Input() aspectRatio: number = 1 / 1;

  @Input() image: string = '';

  @Output() changeImage = new EventEmitter<Blob>();

  public loading: boolean;

  public blob: Blob;

  public device: DeviceInfo;

  constructor(
    private modalCtrl: ModalController,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    Device.getInfo().then(device => this.device = device);

  }

  public fileChangeEvent(event: any) {

    const file = event.target.files[0];

    const reader  = new FileReader();

    if (file) {
      
      reader.onloadend = (data: any) => {
        
        this.blob = UtilsHelper.base64toBlob(data.target.result);

        if (this.blob.type.substr(0, 5) != 'image') {

          this.blob = null;

          this.alertSrv.toast({
            icon: 'error',
            message: 'O arquivo enviado não é uma imagem'
          });

        }

        else {

          this.modalImageCropper(data.target.result);  

        }

      }

      reader.readAsDataURL(file);
      
    }

  }

  public async chooseImage() {

    if (this.device.platform ==  'android' || this.device.platform == 'ios') {

      const image = await Camera.getPhoto({
        quality: 100,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      this.blob = UtilsHelper.base64toBlob(image.dataUrl);

      if (this.blob.type.substr(0, 5) != 'image') {

        this.blob = null;

        this.alertSrv.toast({
          icon: 'error',
          message: 'O arquivo enviado não é uma imagem'
        });

      }

      else {

        this.modalImageCropper(image.dataUrl);       

      }

    }

    else {

      this.inputfile.nativeElement.click();

    }

  }

  private async modalImageCropper(imageBase64: string) {

    this.loading = true;

    const modal = await this.modalCtrl.create({
      component: ModalImageCropperComponent,
      backdropDismiss: false,
      componentProps: {
        image: imageBase64,
        roundCropper: this.rounded,
        aspectRatio: this.aspectRatio
      }
    });

    modal.onWillDismiss()
      .then(res => {

        this.loading = false;
        
        if (res.data) {

          this.image = res.data;

          this.blob = UtilsHelper.base64toBlob(imageBase64);

          this.changeImage.emit(this.blob);

        }

        else {

          this.blob = null;

        }

      });

    return await modal.present();

  }

}
