import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpResult } from 'src/app/models/HttpResult';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) { }

  public getAll() {
    return this.http.get<HttpResult>(`${this.url}/company/paymentMethod`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/company/paymentMethod`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
