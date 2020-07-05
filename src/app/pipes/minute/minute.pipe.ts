import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minute'
})
export class MinutePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
