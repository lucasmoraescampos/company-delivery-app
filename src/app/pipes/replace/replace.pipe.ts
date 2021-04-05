import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: any, searchValue: string, replaceValue: string): unknown {
    return String(value).replace(searchValue, replaceValue);
  }

}
