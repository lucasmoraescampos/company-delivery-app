import { Pipe, PipeTransform } from '@angular/core';
import { NumberHelper } from 'src/app/helpers/NumberHelper';

@Pipe({
  name: 'orderCode'
})
export class OrderCodePipe implements PipeTransform {

  transform(value: number): string {
    return NumberHelper.orderCode(value);
  }

}
