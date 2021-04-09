import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateCustom'
})
export class DateCustomPipe implements PipeTransform {

  transform(value: string): string {

    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    const date = new Date(value);

    const today = new Date();

    const day = date.getDate();

    const month = date.getMonth();

    const year = date.getFullYear();

    const hours = date.getHours();

    const minutes = date.getMinutes();

    if (day == today.getDate() && month == date.getMonth() && year == today.getFullYear()) {

      return `Hoje às ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

    }

    else {

      return `${day < 10 ? '0' + day : day} ${months[month]} às ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

    }
    
  }

}
