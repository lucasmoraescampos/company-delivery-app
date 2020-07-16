import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { CompanyService } from 'src/app/services/company/company.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { DateHelper } from 'src/app/helpers/DateHelper';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public segment: number = 1;

  public company: any;

  public performance: any;

  public view: any[];

  public colorScheme = {
    domain: ['#18a4e0']
  };

  constructor(
    private splashScreen: SplashScreen,
    private platform: Platform,
    private route: ActivatedRoute,
    private alertSrv: AlertService,
    private companySrv: CompanyService,
    private toastSrv: ToastService,
    private loadingSrv: LoadingService,
    private navCtrl: NavController
  ) {

    this.splashScreen.hide();

    this.view = [
      this.platform.width() - 32,
      this.platform.height() * 0.3
    ];

  }

  ngOnInit() {

    this.companySrv.currentUser.subscribe(company => {
      this.company = company;
    });

    if (this.route.snapshot.queryParamMap.get('setup')) {
      this.alertSrv.setupSuccessful();
    }

  }

  ionViewWillEnter() {

    this.preparePerformance();

    this.prepareCompany();

  }

  public refresh(event: any) {

    this.companySrv.get()
      .subscribe(res => {

        if (res.success) {

          this.company = res.data;

          this.companySrv.getPerformance()
            .subscribe(res => {

              if (res.success) {

                this.performance = {
                  days: res.data.days,
                  months: res.data.months
                };

                event.target.complete();

              }

            });

        }

      });

  }

  public segmentChanged(event: any) {
    this.segment = event.detail.value;
  }

  public changeStatus(event: any) {

    if (event.detail.checked) {

      const data = {
        is_open: true
      };

      this.companySrv.update(data)
        .subscribe(res => {

          if (res.success) {

            this.toastSrv.success('Empresa aberta com sucesso!');

          }

        });

    }

    else {

      const data = {
        is_open: false
      };

      this.companySrv.update(data)
        .subscribe(res => {
          if (res.success) {
            this.toastSrv.secondary('Empresa fechada com sucesso!');
          }
        });

    }

  }

  public formatMonth(value: string) {
    const date = new Date(`${value} 00:00:00`);
    return DateHelper.getMonthShortName(date);
  }

  public formatDay(value: string) {
    const date = new Date(`${value} 00:00:00`);
    return DateHelper.getDayShortName(date);
  }

  public wallet() {
    this.navCtrl.navigateForward('wallet');
  }

  private preparePerformance() {

    this.loadingSrv.show();

    this.companySrv.getPerformance()
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.performance = {
            days: res.data.days,
            months: res.data.months
          };

        }

      });

  }

  private prepareCompany() {

    this.loadingSrv.show();

    this.companySrv.get()
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.company = res.data;

        }

      });

  }
}
