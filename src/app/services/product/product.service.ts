import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigHelper } from '../../helpers/ConfigHelper';
import { HttpResult } from '../../models/HttpResult';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) {
  }

  /* Products */ 

  public getAll() {
    return this.http.get<HttpResult>(`${this.url}/company/product`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getById(id: number) {
    return this.http.get<HttpResult>(`${this.url}/company/product/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public create(data: FormData) {
    return this.http.post<HttpResult>(`${this.url}/company/product`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public update(id: number, data: FormData) {

    data.append('_method', 'put');

    return this.http.post<HttpResult>(`${this.url}/company/product/${id}`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete<HttpResult>(`${this.url}/company/product/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  /* Subcategories */

  public getSubcategories() {
    return this.http.get<HttpResult>(`${this.url}/company/subcategory`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

}
