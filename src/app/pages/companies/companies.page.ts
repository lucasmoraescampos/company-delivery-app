import { ModalFirstAccessComponent } from './modal-first-access/modal-first-access.component';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, MenuController, ModalController, NavController } from '@ionic/angular';
import { ModalCompanyComponent } from './modal-company/modal-company.component';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.page.html',
  styleUrls: ['./companies.page.scss'],
})
export class CompaniesPage implements OnInit {

  public user: any;

  constructor(
    private menuCtrl: MenuController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private userSrv: UserService,
    private companySrv: CompanyService,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {

    this.menuCtrl.enable(false);

    this.user = this.userSrv.getCurrentUser();

    if (this.user.plan_subscription == null) {
      this.firstAccess();
    }

  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
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

  private async firstAccess() {

    const modal = await this.modalCtrl.create({
      component: ModalFirstAccessComponent,
      backdropDismiss: false
    });

    modal.onDidDismiss()
      .then(res => {
        this.modalCompany();
      });

    return await modal.present();

  }

}
