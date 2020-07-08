import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast/toast.service';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-add-complement',
  templateUrl: './add-complement.page.html',
  styleUrls: ['./add-complement.page.scss'],
})
export class AddComplementPage implements OnInit {

  public loading: boolean = true;

  public formGroupComplement: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private toastSrv: ToastService,
    private formBuilder: FormBuilder,
    private productSrv: ProductService
  ) { }

  ngOnInit() {

    const product_id = this.navParams.get('product_id');

    this.formGroupComplement = this.formBuilder.group({
      title: [null, Validators.required],
      qty_min: [null, Validators.required],
      qty_max: [null, Validators.required],
      product_id: [product_id, Validators.required]
    });

  }

  public add() {

    if (this.formGroupComplement.valid) {

      this.loading = true;

      const complement = this.formGroupComplement.value;

      this.productSrv.createComplement(complement)
        .subscribe(res => {

          this.loading = false;

          if (res.success) {

            this.toastSrv.success(res.message);

            this.modalCtrl.dismiss(res.data);

          }

        });

    }
    else {

      this.toastSrv.success('Informe todos os dados!');

    }
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }
}
