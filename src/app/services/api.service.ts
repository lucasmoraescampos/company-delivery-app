import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigHelper } from 'src/app/helpers/config.helper';
import { HttpResult } from 'src/app/models/http-result.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) { }

  public getStates() {
    return this.http.get<HttpResult>(`${this.url}/states`);
  }

  public getCities(uf: string) {
    return this.http.get<HttpResult>(`${this.url}/cities/${uf}`);
  }

  public getPaymentMethods() {
    return this.http.get<HttpResult>(`${this.url}/payment-methods`);
  }
  
  public getOnlinePaymentFee() {
    return this.http.get<HttpResult>(`${this.url}/online-payment-fee`);
  }

  public checkDuplicity(data: any) {
    return this.http.post<HttpResult>(`${this.url}/check-duplicity`, data);
  }

  public sendVerificationCode(data: any) {
    return this.http.post<HttpResult>(`${this.url}/send-code-verification`, data);
  }

  public confirmVerificationCode(data: any) {
    return this.http.post<HttpResult>(`${this.url}/confirm-code-verification`, data);
  }

}
