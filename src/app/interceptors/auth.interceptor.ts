import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigHelper } from '../helpers/ConfigHelper';
import { NavController } from '@ionic/angular';
import { LoadingService } from '../services/loading/loading.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private navCtrl: NavController,
        private loadingSrv: LoadingService
    ) { }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        this.loadingSrv.hide();
        if (err.status === 401) {
            localStorage.clear();
            this.navCtrl.navigateRoot('welcome');
            return of(err.message);
        }
        return throwError(err);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = localStorage.getItem(ConfigHelper.Storage.AccessToken);

        if (token != null) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request).pipe(catchError(err => this.handleAuthError(err)));
    }
}