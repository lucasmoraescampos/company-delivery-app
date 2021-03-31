import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDate'
})
export class FilterDatePipe implements PipeTransform {

  /*
   * items: array to be filtered.
   * fields: fields to be filtered. e.g: 'field1' for a single field or 'field1,field2,field3,...' for a multiple fields.
   * value: date in 'd/m/Y' format. e.g: '01/02/2021'
  */
  transform(items: any[], fields: string, value: string): any[] {
    
    if (!items) {
      return [];
    }

    if (value === undefined) {
      return items;
    }

    return items.filter(item => {

      item = flatten(item);

      const keys = fields.split(',');

      return keys.some(key => {
        return formatDate(item[key]).match(new RegExp(`^${value}.*`)) != null;
      });

    });

  }

}

function formatDate(value: string) {

  const date = new Date(value);

  const d = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

  const m = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

  const Y = date.getFullYear();

  return `${d}/${m}/${Y}`;

}

function merge(objects: any) {

  let out = {};

  for (let i = 0; i < objects.length; i++) {

    for (let p in objects[i]) {

      out[p] = objects[i][p];

    }

  }

  return out;

}

/*
 * The method flattens a multi-dimensional array into a single level array that uses "dot" notation to indicate depth
 */
function flatten(obj: any, name?: any, stem?: any) {

  let out = {};

  let newStem = (typeof stem !== 'undefined' && stem !== '') ? stem + '.' + name : name;

  if (typeof obj !== 'object') {

    out[newStem] = obj;

    return out;

  }

  for (let p in obj) {

    let prop = flatten(obj[p], p, newStem);

    out = merge([out, prop]);

  }

  return out;

};