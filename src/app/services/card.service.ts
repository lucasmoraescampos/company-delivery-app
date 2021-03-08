import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResult } from 'src/app/models/http-result.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private url: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public getAll() {
    return this.http.get<HttpResult>(`${this.url}/user/card`);
  }

  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/user/card`, data);
  }
}
