import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, MenuController, ModalController, NavController } from '@ionic/angular';
import { ModalCompanyComponent } from '../../components/modal-company/modal-company.component';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.page.html',
  styleUrls: ['./companies.page.scss'],
})
export class CompaniesPage implements OnInit, OnDestroy {

  public user: any;

  public bannerDefault: string;

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private authSrv: AuthService,
    private companySrv: CompanyService,
    private alertSrv: AlertService,
    private loadingSrv: LoadingService,
    private menuCtrl: MenuController,
    public actionSheetCtrl: ActionSheetController,
    public ngZone: NgZone
  ) { }

  ngOnInit() {

    this.initUser();

    this.checkCompanies();

    this.bannerDefault = environment.imagesUrl + '/banner.png';

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  public async open(company: any) {

    if (company.status == 0) {

      this.alertSrv.show({
        icon: 'info',
        message: 'Falta pouco! Estamos analisando sua empresa, e um de nossos consultores entrará em contato com você para finalizar o cadastro.',
        showCancelButton: false,
        confirmButtonText: 'Entendi'
      });

    }

    else if (company.status == 1) {

      this.companySrv.setCurrentCompany(company);

      this.navCtrl.navigateRoot('/home', { animationDirection: 'forward' });

    }

    else if (company.status == 2) {

      this.alertSrv.show({
        icon: 'error',
        message: 'Empresa suspensa por falta de pagamento! Pague agora mesmo sua fatura e volte a usar nossos serviços.',
        confirmButtonText: 'Pagamento'
      });

    }

  }

  public async modalCompany() {

    const modal = await this.modalCtrl.create({
      component: ModalCompanyComponent,
      backdropDismiss: false
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          this.user.companies.unshift(res.data);
          this.authSrv.setCurrentUser(this.user);
        }
      });

    return await modal.present();

  }
  
  private checkCompanies() {
    if (this.user.companies?.length == 0) {
      this.alertSrv.show({
        icon: 'success',
        message: 'Você já está cadastrado em nosso sistema, agora é a vez de cadastrar suas empresas para começarem os trabalhos.',
        showCancelButton: false,
        confirmButtonText: 'Cadastrar empresa',
        onConfirm: () => {
          this.modalCompany();
        }
      });
    }
  }

  private initUser() {
    this.authSrv.currentUser.pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
        this.ngZone.run(() => {
          this.user = user
        });
      });
  }

}
