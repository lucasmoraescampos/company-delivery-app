import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
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
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private alertSrv: AlertService,
    private companySrv: CompanyService,
    private toastSrv: ToastService,
    private loadingSrv: LoadingService
  ) {

    this.splashScreen.hide();

    this.view = [
      this.platform.width() - 32,
      this.platform.height() * 0.3
    ];

  }

  ngOnInit() {

    this.check();

  }

  public segmentChanged(event: any) {
    this.segment = event.detail.value;
  }

  public changeStatus(event: any) {

    const data = new FormData();

    if (event.detail.checked) {

      data.append('is_open', '1');

      this.companySrv.update(data)
        .subscribe(res => {
          if (res.success) {
            this.toastSrv.success('Empresa aberta com sucesso!');
          }
        });

    }

    else {

      data.append('is_open', '0');

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

  private check() {

    const auth = CompanyService.auth();

    if (auth.status == 0) {
      this.navCtrl.navigateRoot('/waiting-confirmation');
    }

    else if (auth.latitude == null) {
      this.navCtrl.navigateRoot('/setup');
    }

    else if (this.route.snapshot.queryParamMap.get('setup')) {
      this.alertSrv.alertSuccessSetup();
    }

    else {

      this.preparePerformance();

      this.prepareCompany();

    }

  }

  private preparePerformance() {

    this.loadingSrv.show();

    this.companySrv.getPerformance()
      .subscribe(res => {

        this.performance = {
          days: null,
          months: null
        };

        res.data.days.forEach((element: any) => {
          if (element.value > 0) {
            this.performance.days = res.data.days;
          }
        });

        res.data.months.forEach((element: any) => {
          if (element.value > 0) {
            this.performance.months = res.data.months;
          }
        });

        this.loadingSrv.hide();

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
