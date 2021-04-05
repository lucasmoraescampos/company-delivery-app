import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalLocationComponent } from 'src/app/components/modal-location/modal-location.component';
import { ModalPermissionsComponent } from 'src/app/components/modal-permissions/modal-permissions.component';
import { ModalPlansComponent } from 'src/app/components/modal-plans/modal-plans.component';
import { ModalProfileComponent } from 'src/app/components/modal-profile/modal-profile.component';
import { ModalRadiusComponent } from 'src/app/components/modal-radius/modal-radius.component';
import { ModalShareLinkComponent } from 'src/app/components/modal-share-link/modal-share-link.component';
import { ModalVariablesComponent } from 'src/app/components/modal-variables/modal-variables.component';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  public company: any;

  private unsubscribe = new Subject();

  constructor(
    private alertSrv: AlertService,
    private loadingSrv: LoadingService,
    private companySrv: CompanyService,
    private authSrv: AuthService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

    this.company = this.companySrv.getCurrentCompany();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public async modalProfile() {

    const modal = await this.modalCtrl.create({
      component: ModalProfileComponent,
      backdropDismiss: false
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          this.company = res.data;
          this.companySrv.setCurrentCompany(this.company);
        }
      });

    return await modal.present();

  }

  public async modalShareLink() {

    const modal = await this.modalCtrl.create({
      component: ModalShareLinkComponent,
      backdropDismiss: false
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          this.company.slug = res.data;
          this.companySrv.setCurrentCompany(this.company);
        }
      });

    return await modal.present();

  }

  public async modalLocation() {

    const modal = await this.modalCtrl.create({
      component: ModalLocationComponent,
      backdropDismiss: false
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          this.company.slug = res.data;
          this.companySrv.setCurrentCompany(this.company);
        }
      });

    return await modal.present();

  }

  public async modalPlans() {

    const modal = await this.modalCtrl.create({
      component: ModalPlansComponent,
      backdropDismiss: false
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          this.company = res.data;
          this.companySrv.setCurrentCompany(this.company);
        }
      });

    return await modal.present();

  }

  public async modalPermissions() {

    const modal = await this.modalCtrl.create({
      component: ModalPermissionsComponent,
      backdropDismiss: false
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          this.company = res.data;
          this.companySrv.setCurrentCompany(this.company);
        }
      });

    return await modal.present();

  }

  public async modalVariables() {

    const modal = await this.modalCtrl.create({
      component: ModalVariablesComponent,
      backdropDismiss: false
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          this.company = res.data;
          this.companySrv.setCurrentCompany(this.company);
        }
      });

    return await modal.present();

  }

  public async modalRadius() {

    const modal = await this.modalCtrl.create({
      component: ModalRadiusComponent,
      backdropDismiss: false
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          this.company = res.data;
          this.companySrv.setCurrentCompany(this.company);
        }
      });

    return await modal.present();

  }

  public deleteCompany() {

    this.alertSrv.show({
      icon: 'warning',
      message: 'Ao excluir a conta de sua empresa você não poderá reverter essa ação. Caso você recadastre esta empresa passará por todo o processo de analises feito anteriormente. Deseja continuar?',
      confirmButtonText: 'Continuar',
      onConfirm: () => {

        this.loadingSrv.show();

        this.companySrv.delete(this.company.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loadingSrv.hide();

            if (res.success) {

              const user = this.authSrv.getCurrentUser();

              const index = ArrayHelper.getIndexByKey(user.companies, 'id', this.company.id);

              user.companies = ArrayHelper.removeItem(user.companies, index);

              this.authSrv.setCurrentUser(user);

              this.companySrv.clearCurrentCompany();

              this.navCtrl.navigateRoot('/companies', { animationDirection: 'forward' });

              this.alertSrv.toast({
                icon: 'success',
                message: res.message
              });

            }

          });

      }
      
    });
  }

}
