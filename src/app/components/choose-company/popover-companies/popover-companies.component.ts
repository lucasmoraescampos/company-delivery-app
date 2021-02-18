import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController,  PopoverController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { CompanyService } from 'src/app/services/company.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-popover-companies',
  templateUrl: './popover-companies.component.html',
  styleUrls: ['./popover-companies.component.scss'],
})
export class PopoverCompaniesComponent implements OnInit, OnDestroy {

  public user: any;

  public current: any;

  public companies: any[] = [];

  private unsubscribe: Subject<void> = new Subject();
  
  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private userSrv: UserService,
    private alertSrv: AlertService,
    private companySrv: CompanyService
  ) { }

  ngOnInit() {

    this.prepareCompanies();

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  public createCompany() {
    this.navCtrl.navigateForward('/companies?add=true');
    this.popoverCtrl.dismiss();
  }

  public logout() {

    this.alertSrv.show({
      icon: 'question',
      message: 'Deseja realmente sair?',
      confirmButtonText: 'Sair',
      onConfirm: () => {

        this.userSrv.logout()
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

  private prepareCompanies() {
    this.current = this.companySrv.getCurrentCompany();
    this.user = this.userSrv.getCurrentUser();
    this.user.companies.forEach((company: any) => {
      this.companies.push(company);
    });
  }

}
