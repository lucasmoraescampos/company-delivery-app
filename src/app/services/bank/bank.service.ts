import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigHelper } from '../../helpers/ConfigHelper';
import { HttpResult } from '../../models/HttpResult';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) {
  }

  public get() {
    return this.http.get<HttpResult>(`${this.url}/company/bank`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

}
