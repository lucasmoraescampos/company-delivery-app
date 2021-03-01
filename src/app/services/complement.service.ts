import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigHelper } from '../helpers/config.helper';
import { HttpResult } from '../models/http-result.model';

@Injectable({
  providedIn: 'root'
})
export class ComplementService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) { }

  private get companyId() {
    const company = JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentCompany));
    return company.id;
  }
  
  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/company/${this.companyId}/complement`, data);
  }

  public update(id: number, data: any) {
    return this.http.post<HttpResult>(`${this.url}/company/${this.companyId}/complement/${id}`, data);
  }

  public delete(id: number) {
    return this.http.delete<HttpResult>(`${this.url}/company/${this.companyId}/complement/${id}`);
  }

}
