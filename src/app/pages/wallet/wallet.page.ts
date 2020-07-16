import { Component, OnInit } from '@angular/core';
import { WithdrawPage } from '../modal/withdraw/withdraw.page';
import { ModalController } from '@ionic/angular';
import { CompanyService } from 'src/app/services/company/company.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  public company: any;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

    this.company = CompanyService.auth();
    
  }

  public async withdraw() {

    const modal = await this.modalCtrl.create({
      component: WithdrawPage,
      cssClass: 'modal-custom',
    });

    modal.onWillDismiss()
      .then(res => {


      });

    return await modal.present();

  }

}
