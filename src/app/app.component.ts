import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subject } from 'rxjs';
import { LoadingService } from './services/loading.service';
import { takeUntil } from 'rxjs/operators';
import { Router, RoutesRecognized } from '@angular/router';
import { CompanyService } from './services/company.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject();

  public loading: boolean = false;

  public selected_index = 0;

  public company: any;

  public appPages = [
    {
      title: 'Início',
      url: '/home',
      icon: 'home-outline',
      src: false
    },
    {
      title: 'Pedidos',
      url: '/orders',
      icon: 'receipt-outline',
      src: false
    },
    {
      title: 'Mesas',
      url: '/tables',
      icon: false,
      src: '../assets/icon/table.svg'
    },
    {
      title: 'Categorias',
      url: '/categories',
      icon: 'bookmark-outline',
      src: false
    },
    {
      title: 'Produtos',
      url: '/products',
      icon: 'cube-outline',
      src: false
    },
    {
      title: 'Atendentes',
      url: '/attendants',
      icon: false,
      src: '../assets/icon/attendant.svg'
    },
    {
      title: 'Entregadores',
      url: '/delivery-persons',
      icon: false,
      src: '../assets/icon/delivery-person.svg'
    },
    {
      title: 'Relatórios',
      url: '/reports',
      icon: 'bar-chart-outline',
      src: false
    },
    {
      title: 'Configurações',
      url: '/settings',
      icon: 'settings-outline',
      src: false
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private loadingSrv: LoadingService,
    private router: Router,
    private companySrv: CompanyService
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

    this.router.events.pipe(takeUntil(this.unsubscribe))
      .subscribe(route => {
        if (route instanceof RoutesRecognized) {
          const path = '/' + route.state.root.firstChild.routeConfig.path;
          this.selected_index = this.appPages.findIndex(page => page.url === path);
        }
      });

    this.loadingSrv.status.pipe(takeUntil(this.unsubscribe))
      .subscribe(status => {
        this.loading = status;
      });

    this.companySrv.currentCompany.pipe(takeUntil(this.unsubscribe))
      .subscribe(company => {
        this.company = company;
      });

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
