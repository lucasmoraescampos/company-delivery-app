import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';
import { HttpResult } from 'src/app/models/HttpResult';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) { }

  public getAll() {
    return this.http.get<HttpResult>(`${this.url}/company/order`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getById(id: number) {
    return this.http.get<HttpResult>(`${this.url}/company/order/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public accept(id: number) {
    return this.http.put<HttpResult>(`${this.url}/company/order/${id}`, { status: 1 })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public refuse(id: number) {
    return this.http.put<HttpResult>(`${this.url}/company/order/${id}`, { status: 5 })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public release(id: number) {
    return this.http.put<HttpResult>(`${this.url}/company/order/${id}`, { status: 2 })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public complete(id: number) {
    return this.http.put<HttpResult>(`${this.url}/company/order/${id}`, { status: 4 })
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
