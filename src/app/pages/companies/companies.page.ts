import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController, ModalController, NavController } from '@ionic/angular';
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
    private menuCtrl: MenuController
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

  public options(index: number) {

    const company = this.user.companies[index];

    if (company.status == 0) {

      this.alertSrv.show({
        icon: 'info',
        message: 'Falta pouco! Estamos analisando sua empresa, e um de nossos consultores entrará em contato com você para finalizar o cadastro.',
        showCancelButton: false,
        confirmButtonText: 'Entendi'
      });

    }

    else if (company.status == 1) {

      this.alertSrv.options({
        title: company.name,
        buttons: [
          {
            text: 'Entrar',
            icon: 'open-outline',
            callback: () => {
              this.companySrv.setCurrentCompany(company);
              this.navCtrl.navigateRoot('/home', { animationDirection: 'forward' });
            }
          },
          {
            text: 'Editar',
            icon: 'create-outline',
            callback: () =>  {
              this.modalCompany(index);
            }
          },
          {
            text: 'Excluir',
            icon: 'trash-outline',
            callback: () =>  {
              this.deleteCompany(index);
            }
          }
        ]
      });

    }

    else if (company.status == 2) {

      this.alertSrv.show({
        icon: 'error',
        message: 'Empresa suspensa por falta de pagamento! Pague agora mesmo sua fatura e volte a usar nossos serviços.',
        confirmButtonText: 'Pagamento'
      });

    }

  }

  public async modalCompany(index?: number) {

    const modal = await this.modalCtrl.create({
      component: ModalCompanyComponent,
      backdropDismiss: false,
      componentProps: {
        company: this.user.companies[index]
      }
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          if (index !== undefined) {
            this.user.companies[index] = res.data;
            this.authSrv.setCurrentUser(this.user);
          }
          else {
            this.user.companies.unshift(res.data);
            this.authSrv.setCurrentUser(this.user);
          }
        }
      });

    return await modal.present();

  }

  private deleteCompany(index: number) {

    const company = this.user.companies[index];

    this.alertSrv.show({
      icon: 'warning',
      message: `Voce está prestes a excluir a empresa "${company.name}"`,
      onConfirm: () => {

        this.loadingSrv.show();

        this.companySrv.delete(company.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loadingSrv.hide();

            if (res.success) {

              this.user.companies = ArrayHelper.removeItem(this.user.companies, index);

              this.authSrv.setCurrentUser(this.user);

              this.alertSrv.toast({
                icon: 'success',
                message: res.message
              });

            }

          });

      }
    });
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
        this.user = user;
      });
  }

}
