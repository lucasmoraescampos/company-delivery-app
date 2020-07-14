import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { AlertService } from '../../../services/alert/alert.service';
import { HtmlHelper } from '../../../helpers/HtmlHelper';
import { ToastService } from '../../../services/toast/toast.service';
import { NumberHelper } from 'src/app/helpers/NumberHelper';
import { SubcomplementService } from 'src/app/services/subcomplement/subcomplement.service';

@Component({
  selector: 'app-change-subcomplement',
  templateUrl: './change-subcomplement.page.html',
  styleUrls: ['./change-subcomplement.page.scss'],
})
export class ChangeSubcomplementPage implements OnInit {

  public loading: boolean = false;

  public has_price: boolean;

  public info: boolean = false;

  public subcomplement: any;

  public formGroupSubcomplement: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private alertSrv: AlertService,
    private toastSrv: ToastService,
    private subcomplementSrv: SubcomplementService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.subcomplement = this.navParams.get('subcomplement');

    this.has_price = this.subcomplement.price != null ? true : false;

    this.formGroupSubcomplement = this.formBuilder.group({
      description: [this.subcomplement.description, Validators.required],
      price: [this.subcomplement.price]
    });

  }

  public update() {

    if (this.formGroupSubcomplement.valid) {
      
      const subcomplement = this.formGroupSubcomplement.value;
      
      subcomplement.price = NumberHelper.parse(subcomplement.price);

      if (this.has_price && subcomplement.price == 0) {

        this.toastSrv.error('Informe o preço!');

      }

      else {

        this.loading = true;

        this.subcomplementSrv.update(this.subcomplement.id, subcomplement)
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

    this.has_price = event.detail.value == '1' ? true : false;

    this.formGroupSubcomplement.patchValue({
      price: event.detail.value == '1' ? '0,00' : null
    });
    
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public help() {

    this.info = true;

    this.alertSrv.info(HtmlHelper.AddComplementInfo, () => this.info = false);

  }

}
