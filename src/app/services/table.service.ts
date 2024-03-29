import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConfigHelper } from '../helpers/config.helper';
import { HttpResult } from '../models/http-result.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private url: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  private get companyId() {
    const company = JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentCompany));
    return company.id;
  }

  public getAll() {
    return this.http.get<HttpResult>(`${this.url}/company/${this.companyId}/table`);
  }

  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/company/${this.companyId}/table`, data);
  }

  public update(id: number, data: any) {
    return this.http.put<HttpResult>(`${this.url}/company/${this.companyId}/table/${id}`, data);
  }

  public delete(id: number) {
    return this.http.delete<HttpResult>(`${this.url}/company/${this.companyId}/table/${id}`);
  }

}
