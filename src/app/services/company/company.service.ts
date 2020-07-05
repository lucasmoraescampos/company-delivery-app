import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigHelper } from '../../helpers/ConfigHelper';
import { HttpResult } from '../../models/HttpResult';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private url: string = ConfigHelper.Url;

  private currentUserSubject: BehaviorSubject<any>;

  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentUser)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public auth() {
    return this.currentUserSubject.value;
  }

  public static auth() {
    return JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentUser));
  }

  public create(company: any) {
    return this.http.post<HttpResult>(`${this.url}/company/auth/register`, company)
      .pipe(
        map(res => {
          if (res.success) {
            localStorage.setItem(ConfigHelper.Storage.AccessToken, res.token);
            localStorage.setItem(ConfigHelper.Storage.CurrentUser, JSON.stringify(res.data));
            this.currentUserSubject.next(res.data);
          }
          return res;
        })
      );
  }

  public update(data: FormData) {

    data.append('_method', 'put');

    const id = this.currentUserSubject.value.id;

    return this.http.post<HttpResult>(`${this.url}/company/auth/update/${id}`, data)
      .pipe(
        map(res => {
          if (res.success) {
            localStorage.setItem(ConfigHelper.Storage.CurrentUser, JSON.stringify(res.data));
            this.currentUserSubject.next(res.data);
          }
          return res;
        })
      );
  }

  public authenticate(email: string, password: string) {
    return this.http.put<HttpResult>(`${this.url}/company/auth/login`, { email, password })
      .pipe(
        map(res => {
          if (res.success) {
            localStorage.setItem(ConfigHelper.Storage.AccessToken, res.token);
            localStorage.setItem(ConfigHelper.Storage.CurrentUser, JSON.stringify(res.data));
            this.currentUserSubject.next(res.data);
          }
          return res;
        })
      );
  }

  public logout() {
    const token = localStorage.getItem(ConfigHelper.Storage.AccessToken);
    localStorage.clear();
    return this.http.post<HttpResult>(`${this.url}/company/auth/logout`, { token })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public confirmation() {

    const company: any = JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentUser));

    company.status = 1;

    localStorage.setItem(ConfigHelper.Storage.CurrentUser, JSON.stringify(company));

    this.currentUserSubject.next(company);

  }

  public getPerformance() {
    return this.http.get<HttpResult>(`${this.url}/company/auth/performance`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  /****************************************************************************************/

  public verifyPhone(phone: string) {
    return this.http.post<HttpResult>(`${this.url}/user/verify/phone`, { phone })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public verifyEmail(email: string) {
    return this.http.post<HttpResult>(`${this.url}/user/verify/email`, { email })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public sendRegisterCodeConfirmation(phone: string) {
    return this.http.post<HttpResult>(`${this.url}/user/sendRegisterCodeConfirmation`, { phone })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public sendLoginCodeConfirmation(phone: string) {
    return this.http.post<HttpResult>(`${this.url}/user/sendLoginCodeConfirmation`, { phone })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public registerWithPhone(user: any) {
    return this.http.post<HttpResult>(`${this.url}/user/registerWithPhone`, user)
      .pipe(
        map(res => {
          if (res.success) {
            localStorage.setItem(ConfigHelper.Storage.AccessToken, res.token);
            localStorage.setItem(ConfigHelper.Storage.CurrentUser, JSON.stringify(res.data));
            this.currentUserSubject.next(res.data);
          }
          return res;
        })
      );
  }

  public loginWithConfirmationCode(phone: string, sms_code: string) {
    return this.http.post<HttpResult>(`${this.url}/user/loginWithConfirmationCode`, { phone, sms_code })
      .pipe(
        map(res => {
          if (res.success) {
            localStorage.setItem(ConfigHelper.Storage.AccessToken, res.token);
            localStorage.setItem(ConfigHelper.Storage.CurrentUser, JSON.stringify(res.data));
            this.currentUserSubject.next(res.data);
          }
          return res;
        })
      );
  }
}
