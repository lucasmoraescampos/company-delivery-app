import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigHelper } from 'src/app/helpers/config.helper';
import { HttpResult } from 'src/app/models/http-result.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = ConfigHelper.Url;

  private currentUserSubject: BehaviorSubject<any>;

  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentUser)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public getCurrentUser() {
    return this.currentUserSubject.value;
  }

  public setCurrentUser(data: any) {
    localStorage.setItem(ConfigHelper.Storage.CurrentUser, JSON.stringify(data));
    this.currentUserSubject.next(data);
  }

  public authenticate(data: any) {
    return this.http.post<HttpResult>(`${this.url}/user/login`, data)
      .pipe(map(res => {
        if (res.success) {
          localStorage.setItem(ConfigHelper.Storage.AccessToken, res.token);
          this.setCurrentUser(res.data);
        }
        return res;
      }));
  }

  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/user/register`, data)
      .pipe(map(res => {
        if (res.success) {
          localStorage.setItem(ConfigHelper.Storage.AccessToken, res.token);
          this.setCurrentUser(res.data);
        }
        return res;
      }));
  }

  public logout() {
    const token = localStorage.getItem(ConfigHelper.Storage.AccessToken);
    return this.http.post<HttpResult>(`${this.url}/user/logout`, { token })
      .pipe(map(res => {
        if (res.success) {
          localStorage.clear();
        }
        return res;
      }));
  }
}
