import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CompanyService } from 'src/app/services/company/company.service';
import { BankAccountPage } from '../bank-account/bank-account.page';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.page.html',
  styleUrls: ['./withdraw.page.scss'],
})
export class WithdrawPage implements OnInit {

  public company: any;

  public value: string = '0,00';

  constructor(
    private modalCtrl: ModalController
  ) { }


  ngOnInit() {

    this.company = CompanyService.auth();

  }

  public valueChanged() {
    if (this.value.length == 0) {
      this.value = '0,00';
    }
  }

  public async bank() {

    const modal = await this.modalCtrl.create({
      component: BankAccountPage,
      cssClass: 'modal-custom',
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          this.company = res.data;

        }

      });

    return await modal.present();

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }
}
