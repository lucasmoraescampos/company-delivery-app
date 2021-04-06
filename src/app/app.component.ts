import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subject } from 'rxjs';
import { LoadingService } from './services/loading.service';
import { takeUntil } from 'rxjs/operators';
import { Router, RoutesRecognized } from '@angular/router';
import { CompanyService } from './services/company.service';
import { AuthService } from './services/auth.service';
import { ArrayHelper } from './helpers/array.helper';
import { AlertService } from './services/alert.service';
import { UserSocketService } from './services/user-socket.service';
import { ConfigHelper } from './helpers/config.helper';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public loading = false;

  public pageActiveIndex = 0;

  public company: any;

  readonly pages = ConfigHelper.Pages;

  private user: any;

  private socketId: string;

  private unsubscribe = new Subject();

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private loadingSrv: LoadingService,
    private router: Router,
    private companySrv: CompanyService,
    private authSrv: AuthService,
    private navCtrl: NavController,
    private alertSrv: AlertService,
    private userSocketSrv: UserSocketService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {

    this.refreshAuth();

    this.onLoading();

    this.onCompany();

    this.onRouter();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public selectPage(index: number) {
    this.pageActiveIndex = index;
    this.navCtrl.navigateRoot(this.pages[index].url, { animationDirection: 'forward' });
  }

  private refreshAuth() {

    if (location.pathname != '/signin') {

      this.authSrv.auth()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(res => {

          this.user = res.data;

          this.userSocketSrv.subscribe((res) => { // inscrição do socket

            this.socketId = res.data;

            this.userSocketSrv.on('companyStatus', (company) => { // ouvindo o evento: companyStatus

              const index = ArrayHelper.getIndexByKey(this.user.companies, 'id', company.id);

              if (index != -1) {

                if (this.user.companies[index].status != company.status) { // se houve alteração no status

                  if (this.user.companies[index].status == 0 && company.status == 1) { // transição de inativo para ativo

                    this.alertSrv.notification({
                      imageUrl: company.image,
                      title: 'Ativação de empresa',
                      message: 'Concluímos a análisa de sua empresa',
                      duration: 10000,
                      onConfirm: () => {
                        this.navCtrl.navigateForward('/companies');
                      }
                    });

                  }

                  else if (this.user.companies[index].status == 2 && company.status == 1) { // transição de suspenso para ativo

                    this.alertSrv.notification({
                      imageUrl: company.image,
                      title: 'Empresa ativada',
                      message: 'Recebemos o seu pagamento',
                      duration: 10000,
                      onConfirm: () => {
                        this.navCtrl.navigateForward('/companies');
                      }
                    });

                  }

                  else if (company.status == 2) { // transição para suspenso

                    this.alertSrv.notification({
                      imageUrl: company.image,
                      title: 'Empresa suspensa',
                      message: 'Suspensão temporária por falta de pagamento',
                      duration: 10000,
                      onConfirm: () => {
                        this.navCtrl.navigateForward('/companies');
                      }
                    });

                  }

                }

                // Atualiza dados da empresa e avisa os observadores
                this.user.companies[index] = company;
                this.authSrv.setCurrentUser(this.user);

                const current_company = this.companySrv.getCurrentCompany();

                // Se a empresa ouvida for a empresa atual, atualiza a empresa atual
                if (current_company && current_company.id == company.id) {
                  this.companySrv.setCurrentCompany(company);
                }

              }

            });

            this.userSocketSrv.on('created-order', (order) => { // ouvindo o evento: created-order

              const index = ArrayHelper.getIndexByKey(this.user.companies, 'id', order.company_id);

              this.alertSrv.notification({
                imageUrl: this.user.companies[index].image,
                title: 'Pedido',
                message: 'Você tem um novo pedido',
                duration: 10000,
                onConfirm: () => {

                  if (this.company != order.company_id) { // se order não pertence a empresa atual

                    this.companySrv.setCurrentCompany(this.user.companies[index]);

                    this.navCtrl.navigateRoot('/orders', {
                      animationDirection: 'forward',
                      queryParams: {
                        order: order.id
                      }
                    });

                  }

                  else {

                    this.navCtrl.navigateRoot('/orders', {
                      animationDirection: 'forward',
                      queryParams: {
                        order: order.id
                      }
                    });

                  }

                }
              });

            });

            // Cancelando a inscrição do socket em caso de fechamento ou atualização da pagina
            window.onbeforeunload = () => {
              this.userSocketSrv.unsubscribe(this.socketId);
            }

          });

        });

    }

  }

  private onLoading() {
    this.loadingSrv.status.pipe(takeUntil(this.unsubscribe))
      .subscribe(status => {
        this.loading = status;
      });
  }

  private onCompany() {
    this.companySrv.currentCompany.pipe(takeUntil(this.unsubscribe))
      .subscribe(company => {
        this.company = company;
      });
  }

  private onRouter() {
    this.router.events.pipe(takeUntil(this.unsubscribe))
      .subscribe(route => {
        if (route instanceof RoutesRecognized) {
          const path = '/' + route.state.root.firstChild.routeConfig.path;
          this.pageActiveIndex = this.pages.findIndex(page => page.url === path);
        }
      });
  }

}