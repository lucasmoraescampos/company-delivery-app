import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  transform(value: number): string {
    return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value) + ' km';
  }

}
