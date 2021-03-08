import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConfigHelper } from '../helpers/config.helper';
import { HttpResult } from '../models/http-result.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  private get companyId() {
    const company = JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentCompany));
    return company.id;
  }

  public getAll() {
    return this.http.get<HttpResult>(`${this.url}/company/${this.companyId}/product`);
  }
  
  public create(data: FormData) {
    return this.http.post<HttpResult>(`${this.url}/company/${this.companyId}/product`, data);
  }

  public update(id: number, data: FormData) {
    data.append('_method', 'put');
    return this.http.post<HttpResult>(`${this.url}/company/${this.companyId}/product/${id}`, data);
  }

  public delete(id: number) {
    return this.http.delete<HttpResult>(`${this.url}/company/${this.companyId}/product/${id}`);
  }

}
