import { Injectable } from '@angular/core';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';
import { HttpClient } from '@angular/common/http';
import { HttpResult } from 'src/app/models/HttpResult';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) {
  }
  
  public get() {
    return this.http.get<HttpResult>(`${this.url}/company/voucher`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/company/voucher`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public update(id: number, data: any) {
    return this.http.put<HttpResult>(`${this.url}/company/voucher/${id}`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete<HttpResult>(`${this.url}/company/voucher/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
