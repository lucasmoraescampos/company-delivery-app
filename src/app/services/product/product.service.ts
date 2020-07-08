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

  public updatePromotion(id: number, value: number) {
    return this.http.put<HttpResult>(`${this.url}/company/product/promotion/${id}`, { value })
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


  /* Complements */

  public createComplement(data: any) {
    return this.http.post<HttpResult>(`${this.url}/company/product/complement`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public updateComplement(id: number, data: any) {
    return this.http.put<HttpResult>(`${this.url}/company/product/complement/${id}`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public deleteComplement(id: number) {
    return this.http.delete<HttpResult>(`${this.url}/company/product/complement/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  /* Subcomplements */

  public createSubcomplement(data: any) {
    return this.http.post<HttpResult>(`${this.url}/company/product/subcomplement`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public updateSubcomplement(id:number, data: any) {
    return this.http.put<HttpResult>(`${this.url}/company/product/subcomplement/${id}`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  
  public deleteSubcomplement(id: number) {
    return this.http.delete<HttpResult>(`${this.url}/company/product/subcomplement/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

}
