import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByField'
})
export class FilterByFieldPipe implements PipeTransform {

  transform(items: any[], field: string, value: string): any[] {

    if (!items) {
      return [];
    }

    if (field === undefined || value === undefined) {
      return items;
    }

    return items.filter((item) =>
      normalize(item[field]).includes(normalize(value))
    );

  }

}

function normalize(value: string) {

  const map = {
    'a': 'á|à|ã|â|À|Á|Ã|Â',
    'e': 'é|è|ê|É|È|Ê',
    'i': 'í|ì|î|Í|Ì|Î',
    'o': 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
    'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
    'c': 'ç|Ç',
    'n': 'ñ|Ñ'
  };

  value = String(value).toLowerCase();

  for (let pattern in map) {
    value = value.replace(new RegExp(map[pattern], 'g'), pattern);
  };

  return value;

}