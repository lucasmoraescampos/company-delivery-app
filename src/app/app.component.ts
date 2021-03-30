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
import { AngularFireMessaging } from '@angular/fire/messaging';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  private socketId: string;

  private user: any;

  public loading = false;

  public pageActiveIndex = 0;

  public company: any;

  public pages = [
    {
      title: 'Início',
      url: '/home',
      icon: 'home-outline',
      disabled: false
    },
    {
      title: 'Pedidos',
      url: '/orders',
      icon: 'receipt-outline',
      disabled: false
    },
    {
      title: 'Segmentos',
      url: '/segments',
      icon: 'grid-outline',
      disabled: false
    },
    {
      title: 'Produtos',
      url: '/products',
      icon: 'bag-handle-outline',
      disabled: false
    },
    {
      title: 'Entregadores',
      url: '/delivery-persons',
      icon: 'bicycle-outline',
      disabled: true
    },
    {
      title: 'Relatórios',
      url: '/reports',
      icon: 'bar-chart-outline',
      disabled: true
    },
    {
      title: 'Configurações',
      url: '/settings',
      icon: 'settings-outline',
      disabled: true
    }
  ];

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
    private userSocketSrv: UserSocketService,
    private afMessaging: AngularFireMessaging
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

    this.auth();

    this.router.events.pipe(takeUntil(this.unsubscribe))
      .subscribe(route => {
        if (route instanceof RoutesRecognized) {

          const path = '/' + route.state.root.firstChild.routeConfig.path;

          this.pageActiveIndex = this.pages.findIndex(page => page.url === path);

        }
      });

    this.companySrv.currentCompany.pipe(takeUntil(this.unsubscribe))
      .subscribe(company => {
        this.company = company;
      });

    this.loadingSrv.status.pipe(takeUntil(this.unsubscribe))
      .subscribe(status => {
        this.loading = status;
      });

    // this.requestPermission()
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  // requestPermission() {

  //   this.afMessaging.requestToken
  //     .pipe(takeUntil(this.unsubscribe))
  //     .subscribe(
  //       (token) => { console.log(token); },
  //       (error) => { console.error(error); },
  //     );


  //     this.afMessaging.messages
  //     .subscribe((message) => { 
  //       console.log(message); 

  //     });
  // }

  public selectPage(index: number) {
    this.pageActiveIndex = index;
    this.navCtrl.navigateRoot(this.pages[index].url, { animationDirection: 'forward' });
  }

  private auth() {

    if (location.pathname != '/signin') {

      this.authSrv.auth()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(res => {

          this.user = res.data;

          this.userSocketSrv.subscribe(res.data.id, (res) => { // inscrição do socket

            this.socketId = res.data;

            this.userSocketSrv.on('updated-company', (company) => { // ouvindo o evento: updated-company
              this.onUpdatedCompany(company);
            });

            this.userSocketSrv.on('created-order', (order) => { // ouvindo o evento: created-order
              this.onCreatedOrder(order);
            });

            // Cancelando a inscrição do socket em caso de fechamento ou atualização da pagina
            window.onbeforeunload = () => {
              this.userSocketSrv.unsubscribe(this.user.id, this.socketId);
            }

          });

        });

    }

  }

  public onUpdatedCompany(company: any) {

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

    }

  }

  public onCreatedOrder(order: any) {

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

  }

}
