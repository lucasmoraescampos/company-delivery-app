import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigHelper } from '../helpers/config.helper';
import { HttpResult } from '../models/http-result.model';

@Injectable({
  providedIn: 'root'
})
export class AttendantService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) { }

  private get companyId() {
    const company = JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentCompany));
    return company.id;
  }

  public getAll() {
    return this.http.get<HttpResult>(`${this.url}/company/${this.companyId}/attendant`);
  }

  public create(data: FormData) {
    return this.http.post<HttpResult>(`${this.url}/company/${this.companyId}/attendant`, data);
  }

  public update(id: number, data: FormData) {
    data.append('_method', 'put');
    return this.http.post<HttpResult>(`${this.url}/company/${this.companyId}/attendant/${id}`, data);
  }

  public delete(id: number) {
    return this.http.delete<HttpResult>(`${this.url}/company/${this.companyId}/attendant/${id}`);
  }

}
