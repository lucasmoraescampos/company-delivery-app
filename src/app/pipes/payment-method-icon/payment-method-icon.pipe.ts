import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentMethodIcon'
})
export class PaymentMethodIconPipe implements PipeTransform {

  transform(value: string): string {
    if (value == 'amex') {
      return 'amex.svg';
    }
    else if (value == 'diners') {
      return 'diners.svg';
    }
    else if (value == 'elo') {
      return 'elo.svg';
    }
    else if (value == 'hipercard') {
      return 'hipercard.svg';
    }
    else if (value == 'master') {
      return 'mastercard.svg';
    }
    else if (value == 'visa') {
      return 'visa.svg';
    }
  }

}
