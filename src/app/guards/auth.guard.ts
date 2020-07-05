import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CompanyService } from '../services/company/company.service';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
    constructor(
        private navCtrl: NavController,
        private companySrv: CompanyService
    ) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const auth = this.companySrv.auth();
        if (auth) {
            return true;
        }

        this.navCtrl.navigateRoot('welcome');
        return false;
    }
}