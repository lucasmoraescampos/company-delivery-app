import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { ToastService } from '../../../services/toast/toast.service';
import { ComplementService } from 'src/app/services/complement/complement.service';

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
    private toastSrv: ToastService,
    private formBuilder: FormBuilder,
    private complementSrv: ComplementService
  ) { }

  ngOnInit() {

    this.complement = this.navParams.get('complement');

    this.formGroupComplement = this.formBuilder.group({
      title: [this.complement.title, Validators.required],
      qty_min: [this.complement.qty_min],
      qty_max: [this.complement.qty_max, Validators.required],
      is_required: [String(this.complement.is_required), Validators.required]
    });

  }

  public update() {

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

      this.complementSrv.update(this.complement.id, complement)
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

}
