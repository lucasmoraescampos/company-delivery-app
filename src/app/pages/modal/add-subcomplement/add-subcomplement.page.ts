import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { AlertService } from '../../../services/alert/alert.service';
import { HtmlHelper } from '../../../helpers/HtmlHelper';
import { ToastService } from '../../../services/toast/toast.service';
import { ProductService } from '../../../services/product/product.service';
import { NumberHelper } from '../../../helpers/NumberHelper';

@Component({
  selector: 'app-add-subcomplement',
  templateUrl: './add-subcomplement.page.html',
  styleUrls: ['./add-subcomplement.page.scss'],
})
export class AddSubcomplementPage implements OnInit {

  public loading: boolean = false;

  public isNoPrice: boolean = false;

  public info: boolean = false;

  public formGroupSubcomplement: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private alertSrv: AlertService,
    private toastSrv: ToastService,
    private productSrv: ProductService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    const complement_id = this.navParams.get('complement_id');

    this.formGroupSubcomplement = this.formBuilder.group({
      complement_id: [complement_id, Validators.required],
      description: [null, Validators.required],
      price: ['0,00']
    });

  }

  public add() {

    if (this.formGroupSubcomplement.valid) {

      const subcomplement = this.formGroupSubcomplement.value;

      if (subcomplement.price == '0,00') {

        this.toastSrv.error('Informe o valor do item!');

      }

      else {

        this.loading = true;

        subcomplement.price = NumberHelper.parse(subcomplement.price);

        this.productSrv.createSubcomplement(subcomplement)
          .subscribe(res => {

            this.loading = false;

            if (res.success) {

              this.toastSrv.success(res.message);

              this.modalCtrl.dismiss(res.data);

            }

          });

      }

    }
    
    else {

      this.toastSrv.error('Informe todos os dados!');

    }
  }

  public checkPrice(event: CustomEvent) {
    if (event.detail.checked) {
      this.isNoPrice = true;
      this.formGroupSubcomplement.patchValue({
        price: null
      });
    }
    else {
      this.isNoPrice = false;
      this.formGroupSubcomplement.patchValue({
        price: '0,00'
      });
    }
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public help() {

    this.info = true;

    this.alertSrv.info(HtmlHelper.AddComplementInfo, () => this.info = false);

  }
}
