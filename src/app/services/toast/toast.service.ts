import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastController: ToastController
  ) { }

  async success(message: string) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      color: 'success',
      mode: 'ios',
      animated: false,
      cssClass: 'toast-custom animated fadeInDown',
      duration: 4000,
      buttons: [
        {
          side: 'start',
          icon: 'checkmark-circle-outline'
        },
        {
          side: 'end',
          icon: 'close-outline'
        }
      ]
    });
    toast.present();
  }

  async error(message: string) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      color: 'danger',
      mode: 'ios',
      animated: false,
      cssClass: 'toast-custom animated bounceInDown',
      duration: 4000,
      buttons: [
        {
          side: 'start',
          icon: 'close-circle-outline'
        },
        {
          side: 'end',
          icon: 'close-outline'
        }
      ]
    });
    toast.present();
  }

  async secondary(message: string) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      color: 'medium',
      mode: 'ios',
      animated: false,
      cssClass: 'toast-custom animated fadeInDown',
      duration: 4000,
      buttons: [
        {
          side: 'start',
          icon: 'checkmark-circle-outline'
        },
        {
          side: 'end',
          icon: 'close-outline'
        }
      ]
    });
    toast.present();
  }
}
