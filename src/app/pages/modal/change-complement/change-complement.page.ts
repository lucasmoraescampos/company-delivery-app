import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { AlertService } from '../../../services/alert/alert.service';
import { HtmlHelper } from '../../../helpers/HtmlHelper';
import { ProductService } from '../../../services/product/product.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-change-complement',
  templateUrl: './change-complement.page.html',
  styleUrls: ['./change-complement.page.scss'],
})
export class ChangeComplementPage implements OnInit {

  public loading: boolean = false;

  public info: boolean = false;

  public complement: any;

  public formGroupComplement: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private alertSrv: AlertService,
    private productSrv: ProductService,
    private toastSrv: ToastService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.complement = this.navParams.get('complement');

    this.formGroupComplement = this.formBuilder.group({
      title: [this.complement.title, Validators.required],
      qty_min: [this.complement.qty_min, Validators.required],
      qty_max: [this.complement.qty_max, Validators.required]
    });

  }

  public update() {

    if (this.formGroupComplement.valid) {

      this.loading = true;

      const complement = this.formGroupComplement.value;

      this.productSrv.updateComplement(this.complement.id, complement)
        .subscribe(res => {

          this.loading = false;

          if (res.success) {

            this.toastSrv.success(res.message);

            this.modalCtrl.dismiss(res.data);

          }

        });

    }
    else {

      this.toastSrv.error('Informe todos os dados!');

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
