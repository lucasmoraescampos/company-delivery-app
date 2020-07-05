import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentMethod'
})
export class PaymentMethodPipe implements PipeTransform {

  transform(value: string): string {
    if (value == 'amex') {
      return 'American Express';
    }
    else if (value == 'diners') {
      return 'Diners Club';
    }
    else if (value == 'elo') {
      return 'Elo';
    }
    else if (value == 'hipercard') {
      return 'Hipercard';
    }
    else if (value == 'master') {
      return 'Mastercard';
    }
    else if (value == 'visa') {
      return 'Visa';
    }
  }

}
