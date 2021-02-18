import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigHelper } from '../helpers/config.helper';
import { HttpResult } from '../models/http-result.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) { }

  private get companyId() {
    const company = JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentCompany));
    return company.id;
  }

  public getAll() {
    return this.http.get<HttpResult>(`${this.url}/company/${this.companyId}/category`);
  }

  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/company/${this.companyId}/category`, data);
  }

  public reorder(data: any) {
    return this.http.post<HttpResult>(`${this.url}/company/${this.companyId}/category/reorder`, data);
  }

  public update(id: number, data: any) {
    return this.http.put<HttpResult>(`${this.url}/company/${this.companyId}/category/${id}`, data);
  }

  public delete(id: number) {
    return this.http.delete<HttpResult>(`${this.url}/company/${this.companyId}/category/${id}`);
  }
  
}
