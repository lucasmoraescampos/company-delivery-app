import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { VoucherService } from 'src/app/services/voucher/voucher.service';
import { ModalController, IonContent } from '@ionic/angular';
import { AddVoucherPage } from '../modal/add-voucher/add-voucher.page';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';
import { VoucherDetailsPage } from '../modal/voucher-details/voucher-details.page';

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.page.html',
  styleUrls: ['./vouchers.page.scss'],
})
export class VouchersPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  public segment: string = 'available';

  public vouchers: Array<any>;

  public allVouchers: Array<any>;

  constructor(
    private loadingSrv: LoadingService,
    private voucherSrv: VoucherService,
    private modalCtrl: ModalController,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.prepareVouchers();

  }

  public changeSegment(event: any) {

    this.segment = event.detail.value;

    this.filterVouchers();

  }

  public async add() {

    const modal = await this.modalCtrl.create({
      component: AddVoucherPage,
      cssClass: 'modal-custom'
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          this.content.scrollToTop(1000);

          this.allVouchers.unshift(res.data);

          this.filterVouchers();

        }

      });

    await modal.present();

  }

  public async details(voucher: any) {

    const modal = await this.modalCtrl.create({
      component: VoucherDetailsPage,
      cssClass: 'modal-custom',
      componentProps: {
        voucher: voucher
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          const index = ArrayHelper.getIndexByKey(this.allVouchers, 'id', voucher.id);

          this.allVouchers[index] = res.data;

          this.filterVouchers();

        }

      });

    await modal.present();

  }

  public delete(voucher: any) {

    this.alertSrv.confirm(`Excluir ${voucher.code}?`, () => {

      this.loadingSrv.show();

      this.voucherSrv.delete(voucher.id)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            const index = ArrayHelper.getIndexByKey(this.vouchers, 'id', voucher.id);

            this.vouchers = ArrayHelper.removeItem(this.vouchers, index);

          }

        });

    });

  }

  private filterVouchers() {

    this.vouchers = [];

    if (this.segment == 'available') {

      this.allVouchers.forEach(voucher => {

        if (new Date(voucher.expiration_date) >= new Date()) {

          this.vouchers.push(voucher);

        }

      });

    }

    else {

      this.allVouchers.forEach(voucher => {

        if (new Date(voucher.expiration_date) < new Date()) {

          this.vouchers.push(voucher);

        }

      });

    }

  }

  private prepareVouchers() {

    this.loadingSrv.show();

    this.voucherSrv.get()
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.allVouchers = res.data;

          this.filterVouchers();

        }

      });

  }

}
