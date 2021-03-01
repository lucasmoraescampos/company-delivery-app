import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { ModalCompanyComponent } from '../../components/modal-company/modal-company.component';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { ArrayHelper } from 'src/app/helpers/array.helper';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.page.html',
  styleUrls: ['./companies.page.scss'],
})
export class CompaniesPage implements OnInit, OnDestroy {

  public user: any;

  public unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private authSrv: AuthService,
    private companySrv: CompanyService,
    private actionSheetCtrl: ActionSheetController,
    private alertSrv: AlertService,
    private loadingSrv: LoadingService
  ) { }

  ngOnInit() {

    this.initUser();

    this.checkCompanies();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public async options(index: number) {

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opções',
      buttons: [{
        text: 'Entrar',
        handler: () => {
          this.companySrv.setCurrentCompany(this.user.companies[index]);
          this.navCtrl.navigateRoot('/home', { animationDirection: 'forward' });
        }
      }, {
        text: 'Editar',
        handler: () => {
          this.modalCompany(index);
        }
      }, {
        text: 'Excluir',
        handler: () => {
          this.deleteCompany(index);
        }
      }, {
        text: 'Cancelar',
        role: 'cancel'
      }]
    });

    await actionSheet.present();

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
