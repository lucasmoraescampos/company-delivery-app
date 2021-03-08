import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResult } from 'src/app/models/http-result.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url: string = environment.apiUrl;

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
