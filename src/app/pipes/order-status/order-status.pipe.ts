import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {

  transform(value: string, is_withdrawal_local: number = 0): string {
    if (value == '0') {
      return 'Aguardando confirmação';
    }
    else if (value == '1') {
      return 'Em andamento';
    }
    else if (value == '2') {
      return is_withdrawal_local == 1 ? 'Aguardando Retirada' : 'Aguardando Entrega';
    }
    else if (value == '3') {
      return 'Entregando';
    }
    else if (value == '4') {
      return 'Finalizado';
    }
    else if (value == '5') {
      return 'Recusado';
    }
  }

}
