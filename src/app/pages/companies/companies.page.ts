import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { ModalCompanyComponent } from '../../components/modal-company/modal-company.component';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.page.html',
  styleUrls: ['./companies.page.scss'],
})
export class CompaniesPage implements OnInit {

  public user: any;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private authSrv: AuthService,
    private companySrv: CompanyService,
    private actionSheetCtrl: ActionSheetController,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.user = this.authSrv.user;

    this.checkCompanies();

  }

  public async options(company: any) {

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opções',
      buttons: [{
        text: 'Entrar',
        handler: () => {
          this.companySrv.setCurrentCompany(company);
          this.navCtrl.navigateRoot('/home', { animationDirection: 'forward' });
        }
      }, {
        text: 'Editar',
        handler: () => {

        }
      }, {
        text: 'Cancelar',
        role: 'cancel'
      }]
    });

    await actionSheet.present();

  }

  public async modalCompany() {

    const modal = await this.modalCtrl.create({
      component: ModalCompanyComponent,
      backdropDismiss: false
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          this.user.companies.push(res.data);
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

}
