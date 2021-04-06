import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpResult } from '../models/http-result.model';

@Injectable({
  providedIn: 'root'
})
export class FcmTokenService {

  private url: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public checkInFcmTokenWithAuth(token: string) {
    return this.http.post<HttpResult>(`${this.url}/user/check-in-fcm-token-with-auth`, { token });
  }

  public checkInFcmTokenWithoutAuth(token: string) {
    return this.http.post<HttpResult>(`${this.url}/user/check-in-fcm-token-without-auth`, { token });
  }
  
}
