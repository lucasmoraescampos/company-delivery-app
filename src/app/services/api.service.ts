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

  public getCategories() {
    return this.http.get<HttpResult>(`${this.url}/categories`);
  }

  public getPlans(category_id: number) {
    return this.http.get<HttpResult>(`${this.url}/category/${category_id}/plans`);
  }

  public getPaymentMethods() {
    return this.http.get<HttpResult>(`${this.url}/payment-methods`);
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
