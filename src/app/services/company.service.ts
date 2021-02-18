import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigHelper } from 'src/app/helpers/config.helper';
import { HttpResult } from 'src/app/models/http-result.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  public currentCompany: Observable<any>;

  private currentCompanySubject: BehaviorSubject<any>;

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient,
    private userSrv: UserService
  ) {
    this.currentCompanySubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentCompany)));
    this.currentCompany = this.currentCompanySubject.asObservable();
  }

  public getCurrentCompany() {
    return this.currentCompanySubject.value;
  }

  public setCurrentCompany(data: any) {
    localStorage.setItem(ConfigHelper.Storage.CurrentCompany, JSON.stringify(data));
    this.currentCompanySubject.next(data);
  }
  
  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/user/company`, data)
      .pipe(map(res => {
        if (res.success) {
          const current_user = JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentUser));
          current_user.companies.push(res.data);
          this.userSrv.setCurrentUser(current_user);
        }
        return res;
      }));
  }

}
