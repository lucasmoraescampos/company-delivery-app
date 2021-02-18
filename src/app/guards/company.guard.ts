import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ConfigHelper } from '../helpers/config.helper';

@Injectable({ providedIn: 'root' })

export class CompanyGuard implements CanActivate {
	constructor(
		private navCtrl: NavController
	) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

		const current_company = localStorage.getItem(ConfigHelper.Storage.CurrentCompany);

		if (current_company) {
			return true;
		}

		this.navCtrl.navigateRoot('/companies');

		return false;

	}
}