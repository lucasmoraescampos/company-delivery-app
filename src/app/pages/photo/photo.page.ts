import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { ActionSheetController } from '@ionic/angular';
import { Base64Helper } from 'src/app/helpers/Base64Helper';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';

const { Camera } = Plugins;

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {

  public image: string;

  private blob: Blob;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private toastSrv: ToastService
  ) { }

  ngOnInit() {
  }

  public async setImage() {

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Escolha um opção',
      buttons: [
        {
          text: 'Galeria',
          icon: 'image',
          handler: () => {
            this.gallery();
          }
        },
        {
          text: 'Câmera',
          icon: 'camera',
          handler: () => {
            this.camera();
          }
        }
      ]
    });

    await actionSheet.present();

  }

  private async camera() {

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.blob = Base64Helper.toBlob(image.dataUrl, image.format);

    if (this.blob.size > 8388608) {

      this.blob = null;

      this.toastSrv.error('A imagem escolhida é muito grande, escolha uma imagem menor que 8MB!');

    }

    else {

      this.image = image.dataUrl;

      localStorage.setItem(ConfigHelper.Storage.Setup.Photo, JSON.stringify(image));

    }

  }

  private async gallery() {

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });

    this.blob = Base64Helper.toBlob(image.dataUrl, image.format);

    if (this.blob.size > 8388608) {

      this.blob = null;

      this.toastSrv.error('A imagem escolhida é muito grande, escolha uma imagem menor que 8MB!');

    }

    else {

      this.image = image.dataUrl;

      localStorage.setItem(ConfigHelper.Storage.Setup.Photo, JSON.stringify(image));

    }

  }

}
