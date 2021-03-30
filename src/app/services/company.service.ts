import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigHelper } from 'src/app/helpers/config.helper';
import { HttpResult } from 'src/app/models/http-result.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  public currentCompany: Observable<any>;

  private currentCompanySubject: BehaviorSubject<any>;s

  private url: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {
    this.currentCompanySubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentCompany)));
    this.currentCompany = this.currentCompanySubject.asObservable();
  }

  public setCurrentCompany(data: any) {
    localStorage.setItem(ConfigHelper.Storage.CurrentCompany, JSON.stringify(data));
    this.currentCompanySubject.next(data);
  }


  // rest methods

  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/user/company`, data);
  }

  public update(id: number, data: any) {
    return this.http.put<HttpResult>(`${this.url}/user/company/${id}`, data);
  }

  public delete(id: number) {
    return this.http.delete<HttpResult>(`${this.url}/user/company/${id}`);
  }

}
