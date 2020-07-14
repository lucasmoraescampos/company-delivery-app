import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast/toast.service';
import { ComplementService } from 'src/app/services/complement/complement.service';

@Component({
  selector: 'app-add-complement',
  templateUrl: './add-complement.page.html',
  styleUrls: ['./add-complement.page.scss'],
})
export class AddComplementPage implements OnInit {

  public loading: boolean = false;

  public formGroupComplement: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private toastSrv: ToastService,
    private formBuilder: FormBuilder,
    private complementSrv: ComplementService
  ) { }

  ngOnInit() {

    const product_id = this.navParams.get('product_id');

    this.formGroupComplement = this.formBuilder.group({
      title: [null, Validators.required],
      qty_min: [null],
      qty_max: [null, Validators.required],
      product_id: [product_id, Validators.required],
      is_required: [null, Validators.required]
    });

  }

  public add() {

    if (this.formGroupComplement.valid) {

      const complement = this.formGroupComplement.value;

      if (complement.is_required == 1 && complement.qty_min < 1) {

        this.toastSrv.error('Informe a quantidade mínima!');

        return;

      }

      if (complement.is_required == 1 && complement.qty_min > complement.qty_max) {

        this.toastSrv.error('Quantidade mínima não pode ser maior do que a máxima!');

        return;

      }

      if (complement.qty_max < 1) {

        this.toastSrv.error('Informe a quantidade máxima!');

        return;

      }

      this.loading = true;
      
      complement.qty_min = complement.is_required == 1 ? complement.qty_min : null;

      this.complementSrv.create(complement)
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
