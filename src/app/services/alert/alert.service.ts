import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  public success(message: string, timer?: number): void {
    Swal.fire({
      position: 'center',
      icon: 'success',
      text: message,
      showConfirmButton: false,
      heightAuto: false,
      timer: timer || 2500
    });
  }

  public error(message: string, timer?: number): void {
    Swal.fire({
      position: 'center',
      icon: 'error',
      text: message,
      showConfirmButton: false,
      heightAuto: false,
      timer: timer || 2500
    });
  }

  public info(message: string, onClose?: Function): void {
    Swal.fire({
      imageUrl: '../../../assets/icon/help.svg',
      // imageWidth: '80px',
      title: 'Ajuda',
      html: message,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false,
      heightAuto: false,
      // onClose: onClose
    });
  }

  public confirm(message: string, next: Function): void {
    Swal.fire({
      title: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      heightAuto: false,
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value) {
        next();
      }
    });
  }

  public alertSuccessSetup(): void {
    Swal.fire({
      title: 'Que comecem os trabalhos!',
      text: 'Suas configurações foram definidas com sucesso, e você já pode começar a cadastrar os seus produtos e até receber pedidos!',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'COMEÇAR',
      heightAuto: false,
      allowOutsideClick: false,
      customClass: {
        header: 'ion-margin-bottom',
        content: 'ion-text-justify'
      }
    });
  }

}
