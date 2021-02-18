import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  public show(options: AlertOptions) {
    Swal.fire({
      icon: options.icon,
      iconColor: '#e60506',
      title: options.message,
      showCancelButton: options.showCancelButton !== undefined ? options.showCancelButton : true,
      confirmButtonText: options.confirmButtonText ? options.confirmButtonText : 'Confirmar',
      cancelButtonText: options.cancelButtonText ? options.cancelButtonText : 'Cancelar',
      heightAuto: false,
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(result => {
      if (result.value) {
        if (options.onConfirm) {
          options.onConfirm();
        }
      }
      else {
        if (options.onCancel) {
          options.onCancel();
        }
      }
    });
  }

  public toast(options: AlertOptions) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: options.duration ? options.duration : 4500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: options.icon,
      title: options.message
    });
  }

  public terms(options: AlertOptions) {
    Swal.fire({
      imageUrl: '../../../assets/icon/terms.svg',
      imageWidth: 60,
      title: 'Termos e condições',
      html: 'Eu concordo com os <a>termos e condições</a>',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText ? options.confirmButtonText : 'Confirmar',
      cancelButtonText: options.cancelButtonText ? options.cancelButtonText : 'Cancelar',
      heightAuto: false,
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(result => {
      if (result.value) {
        options.onConfirm();
      }
    });
  }

}

export interface AlertOptions {
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  onConfirm?: Function;
  onCancel?: Function;
  duration?: number;
  icon?: SweetAlertIcon;
}