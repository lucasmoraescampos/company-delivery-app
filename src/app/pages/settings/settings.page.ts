import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company/company.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { PaymentMethodService } from 'src/app/services/payment-method/payment-method.service';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';
import { ToastService } from 'src/app/services/toast/toast.service';
import { NumberHelper } from 'src/app/helpers/NumberHelper';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { ActionSheetController } from '@ionic/angular';
import { Base64Helper } from 'src/app/helpers/Base64Helper';

const { Camera } = Plugins;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  private blob: Blob;

  public company: any;

  public category: any;

  public payment_methods: any[];

  public segment: string = 'profile';

  public formGroupProfile: FormGroup;

  public formGroupDelivery: FormGroup;

  public formGroupPayment: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private companySrv: CompanyService,
    private categorySrv: CategoryService,
    private loadingSrv: LoadingService,
    private paymentMethodSrv: PaymentMethodService,
    private toastSrv: ToastService,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {

    this.company = this.companySrv.auth();

    this.prepareCategory(this.company.category_id);

    this.preparePaymentMethods();

    this.formGroupProfile = this.formBuilder.group({
      name: [this.company.name, Validators.required],
      phone: [this.company.phone, Validators.required]
    });

    this.formGroupDelivery = this.formBuilder.group({
      min_value: [NumberHelper.cents(this.company.min_value), Validators.required],
      delivery_price: [NumberHelper.cents(this.company.delivery_price), Validators.required],
      waiting_time: [this.company.waiting_time, Validators.required],
      range: [this.company.range, Validators.required],
      accept_outsourced_delivery: [this.company.accept_outsourced_delivery, Validators.required],
      accept_withdrawal_local: [this.company.accept_withdrawal_local, Validators.required]
    });

    this.formGroupPayment = this.formBuilder.group({
      accept_payment_app: [this.company.accept_payment_app, Validators.required],
      accept_payment_delivery: [this.company.accept_payment_delivery, Validators.required]
    });

  }

  public segmentChanged(event: CustomEvent) {
    this.segment = event.detail.value;
  }

  public paymentMethodsChanged(event: CustomEvent) {
    
    if (event.detail.checked) {

      this.company.payment_methods.push(event.detail.value);

    }

    else {

      const index = ArrayHelper.getIndexByKey(this.company.payment_methods, 'id', event.detail.value);

      this.company.payment_methods = ArrayHelper.removeItem(this.company.payment_methods, index);

    }

  }

  public isChecked(id: number) {
    return this.company.payment_methods.indexOf(id) != -1;
  }

  public updateProfile() {

    if (this.formGroupProfile.valid) {
      
      this.loadingSrv.show();

      const data = this.formGroupProfile.value;

      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('photo', this.blob);

      this.companySrv.update(formData)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            this.toastSrv.success('Perfil atualizado com sucesso!');

          }

        });

    }

  }

  public updateDelivery() {

    if (this.formGroupDelivery.valid) {

      if (this.formGroupDelivery.value.waiting_time == 0) {

        this.toastSrv.error('Informe o tempo de espera!');

        return;

      }
      
      this.loadingSrv.show();

      const data = this.formGroupDelivery.value;

      data.min_value = NumberHelper.parse(data.min_value);

      data.delivery_price = NumberHelper.parse(data.delivery_price);

      this.companySrv.update(data)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            this.toastSrv.success('Delivery atualizado com sucesso!');

          }

        });

    }

  }

  public updatePayment() {

    if (this.formGroupPayment.valid) {

      if (this.formGroupPayment.value.accept_payment_delivery && this.company.payment_methods.length == 0) {

        this.toastSrv.error('Selecione os métodos disponíveis para pagamentos na entrega!');

        return;

      }
      
      this.loadingSrv.show();

      const data = this.formGroupPayment.value;

      if (this.formGroupPayment.value.accept_payment_delivery) {

        data.payment_methods = this.company.payment_methods;

      }

      this.companySrv.update(data)
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            this.toastSrv.success('Métodos de pagamento atualizado com sucesso!');

          }

          else {

            this.toastSrv.error(res.message);

          }

        });

    }

  }

  public async choosePhoto() {

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Escolha um opção',
      buttons: [
        {
          text: 'Galeria',
          icon: 'image',
          handler: () => {
            this.gallery();
          }
        },
        {
          text: 'Câmera',
          icon: 'camera',
          handler: () => {
            this.camera();
          }
        }
      ]
    });

    await actionSheet.present();

  }

  private async camera() {

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.blob = Base64Helper.toBlob(image.dataUrl, image.format);

    if (this.blob.size > 8388608) {

      this.blob = null;

      this.toastSrv.error('A imagem escolhida é muito grande, escolha uma imagem menor que 8MB!');

    }

    else {

      this.blob = Base64Helper.toBlob(image.dataUrl, image.format);

      this.company.photo = image.dataUrl;

    }

  }

  private async gallery() {

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });

    this.blob = Base64Helper.toBlob(image.dataUrl, image.format);

    if (this.blob.size > 8388608) {

      this.blob = null;

      this.toastSrv.error('A imagem escolhida é muito grande, escolha uma imagem menor que 8MB!');

    }

    else {

      this.blob = Base64Helper.toBlob(image.dataUrl, image.format);

      this.company.photo = image.dataUrl;

    }

  }

  private prepareCategory(id: number) {

    this.loadingSrv.show();

    this.categorySrv.getById(id)
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.category = res.data;

        }
        
      });
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
