import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigHelper } from '../../helpers/ConfigHelper';
import { HttpResult } from 'src/app/models/HttpResult';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComplementService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) {
  }

  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/company/complement`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public update(id: number, data: any) {
    return this.http.put<HttpResult>(`${this.url}/company/complement/${id}`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete<HttpResult>(`${this.url}/company/complement/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
