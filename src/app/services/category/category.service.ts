import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';
import { HttpResult } from 'src/app/models/HttpResult';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) { }
  
  public getAll() {
    return this.http.get<HttpResult>(`${this.url}/company/category`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getById(id: number) {
    return this.http.get<HttpResult>(`${this.url}/company/category/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  
}
