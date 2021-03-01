import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-popover-companies',
  templateUrl: './popover-companies.component.html',
  styleUrls: ['./popover-companies.component.scss'],
})
export class PopoverCompaniesComponent implements OnInit, OnDestroy {

  public user: any;

  public current: any;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private alertSrv: AlertService,
    private companySrv: CompanyService,
    private authSrv: AuthService
  ) { }

  ngOnInit() {

    this.user = this.authSrv.user;

    this.companySrv.currentCompany.pipe(takeUntil(this.unsubscribe))
      .subscribe(company => {
        this.current = company;
      });

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public companies() {
    this.navCtrl.navigateForward('/companies');
    this.popoverCtrl.dismiss();
  }

  public enterCompany(company: any) {
    this.popoverCtrl.dismiss();
    this.companySrv.setCurrentCompany(company);
    this.navCtrl.navigateRoot('/home', { animationDirection: 'forward' });
  }

  public logout() {
    this.alertSrv.show({
      icon: 'warning',
      message: 'Deseja realmente sair?',
      confirmButtonText: 'Sair',
      onConfirm: () => {
        this.authSrv.logout()
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {
            if (res.success) {
              this.popoverCtrl.dismiss();
              this.navCtrl.navigateRoot('/signin', { animationDirection: 'forward' });
            }
          });
      }
    });

  }

}
