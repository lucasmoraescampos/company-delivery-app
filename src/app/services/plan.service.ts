import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ConfigHelper } from 'src/app/helpers/config.helper';
import { HttpResult } from 'src/app/models/http-result.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private url: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public getAll() {
    return this.http.get<HttpResult>(`${this.url}/user/plan`);
  }

  public subscription(data: any) {
    return this.http.post<HttpResult>(`${this.url}/user/plan`, data)
      .pipe(
        map(res => {
          if (res.success) {
            const user = JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentUser));
            user.plan_subscription = res.data;
            localStorage.setItem(ConfigHelper.Storage.CurrentUser, JSON.stringify(user));
          }
          return res;
        })
      );
  }
}
