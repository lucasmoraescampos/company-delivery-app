import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { VoucherService } from 'src/app/services/voucher/voucher.service';
import { NumberHelper } from 'src/app/helpers/NumberHelper';
import { DateHelper } from 'src/app/helpers/DateHelper';

@Component({
  selector: 'app-voucher-details',
  templateUrl: './voucher-details.page.html',
  styleUrls: ['./voucher-details.page.scss'],
})
export class VoucherDetailsPage implements OnInit {

  public loading: boolean = false;

  public formGroupVoucher: FormGroup;

  public min_date: string;

  private voucher: any;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private toastSrv: ToastService,
    private voucherSrv: VoucherService,
    private navParams: NavParams
  ) { }

  ngOnInit() {

    this.voucher = this.navParams.get('voucher');

    const date = DateHelper.formatISO(new Date(this.voucher.expiration_date));

    const value = NumberHelper.cents(this.voucher.value);

    const min_value = NumberHelper.cents(this.voucher.min_value);

    this.min_date = new Date().toISOString();

    this.formGroupVoucher = this.formBuilder.group({
      code: [this.voucher.code, Validators.required],
      qty: [this.voucher.qty, Validators.required],
      value: [value, Validators.required],
      min_value: [min_value, Validators.required],
      expiration_date: [date, Validators.required],
      expiration_time: [date, Validators.required]
    });

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public checkCode(event: any) {

    let newValue = event.target.value;

    let regExp = new RegExp('^[A-Za-z0-9? ]+$');

    if (! regExp.test(newValue)) {
      event.target.value = newValue.slice(0, -1);
    }

  }

  public update() {

    if (this.formGroupVoucher.valid) {

      const voucher = this.formGroupVoucher.value;

      voucher.qty = NumberHelper.parse(voucher.qty);

      voucher.value = NumberHelper.parse(voucher.value);

      voucher.min_value = NumberHelper.parse(voucher.min_value);

      if (voucher.qty == 0) {

        this.toastSrv.error('A quantidade deve ser maior que zero!');

        return;

      }

      if (voucher.value == 0) {

        this.toastSrv.error('O valor deve ser maior que zero!');

        return;

      }

      if (voucher.min_value == 0) {

        this.toastSrv.error('O valor mínimo deve ser maior que zero!');

        return;

      }

      this.loading = true;

      const date = DateHelper.getDate(new Date(voucher.expiration_date));

      const time = DateHelper.getTime(new Date(voucher.expiration_time));

      const data = {
        code: voucher.code,
        qty: voucher.qty,
        value: voucher.value,
        min_value: voucher.min_value,
        expiration_date: `${date}T${time}`
      };

      this.voucherSrv.update(this.voucher.id, data)
        .subscribe(res => {

          this.loading = false;

          if (res.success) {

            this.toastSrv.success(res.message);

            this.modalCtrl.dismiss(res.data);

          }

          else {

            this.toastSrv.error(res.message);

          }

        });

    }

    else {

      this.toastSrv.error('Informe todos os dados!');

    }

  }

}
