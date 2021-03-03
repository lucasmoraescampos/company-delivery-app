import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { ConfigHelper } from '../helpers/config.helper';

@Injectable({ providedIn: 'root' })

export class CompanyGuard implements CanActivate {

	constructor(
		private navCtrl: NavController,
		private menuCtrl: MenuController
	) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

		const company = JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentCompany));

		if (company && company.status == 1) {

			this.menuCtrl.enable(true);
			
			return true;

		}
		
		this.navCtrl.navigateRoot('/companies');

		return false;

	}
}