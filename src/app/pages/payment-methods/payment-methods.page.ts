import { Component, OnInit } from '@angular/core';
import { PaymentMethodService } from 'src/app/services/payment-method/payment-method.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';
import { Base64Helper } from 'src/app/helpers/Base64Helper';
import { CompanyService } from 'src/app/services/company/company.service';
import { NavController } from '@ionic/angular';
import { NumberHelper } from 'src/app/helpers/NumberHelper';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.page.html',
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit {

  public payment_methods: Array<any>;

  public selecteds: Array<any> = [];

  constructor(
    private paymentMethodSrv: PaymentMethodService,
    private loadingSrv: LoadingService,
    private toastSrv: ToastService,
    private companySrv: CompanyService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {

    this.preparePaymentMethods();

  }

  public finish() {

    if (this.selecteds.length > 0) {
      
      this.loadingSrv.show();

      const image = JSON.parse(localStorage.getItem(ConfigHelper.Storage.Setup.Photo));

      const blob = Base64Helper.toBlob(image.dataUrl, image.format);
      
      const location = JSON.parse(localStorage.getItem(ConfigHelper.Storage.Setup.Location));

      const delivery = JSON.parse(localStorage.getItem(ConfigHelper.Storage.Setup.Delivery));

      const data = new FormData();

      data.append('photo', blob);
      data.append('street_name', location.street_name);
      data.append('street_number', location.street_number);
      data.append('district', location.district);
      data.append('city', location.city);
      data.append('uf', location.uf);
      data.append('country', location.country);
      data.append('zipcode', location.zipcode);
      data.append('latitude', location.latitude);
      data.append('longitude', location.longitude);
      data.append('complement', location.complement);
      data.append('waiting_time', delivery.waiting_time);
      data.append('min_value', NumberHelper.parse(delivery.min_value).toString());

      this.companySrv.update(data)
        .subscribe(res => {

          if (res.success) {

            const payments_methods = {
              payment_methods: this.selecteds
            };

            this.paymentMethodSrv.create(payments_methods)
              .subscribe(res => {

                if (res.success) {

                  this.loadingSrv.hide();

                  localStorage.removeItem(ConfigHelper.Storage.Setup.Delivery);
                  localStorage.removeItem(ConfigHelper.Storage.Setup.Photo);
                  localStorage.removeItem(ConfigHelper.Storage.Setup.Location);

                  this.navCtrl.navigateRoot('/tabs/home?setup=success');

                }

              });

          }

        });

    }

    else {

      this.toastSrv.error('Selecione suas formas de pagamento!');

    }

  }

  public change(event: any) {

    if (event.detail.checked) {

      this.selecteds.push(event.detail.value);

    }

    else {

      let array = [];

      this.selecteds.forEach(id => {

        if (id != event.detail.value) {

          array.push(id);

        }

      });

      this.selecteds = array;

    }

    console.log(this.selecteds);

  }

  private preparePaymentMethods() {

    this.loadingSrv.show();

    this.paymentMethodSrv.getAll()
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {
          this.payment_methods = res.data;
        }
      });
  }

}
