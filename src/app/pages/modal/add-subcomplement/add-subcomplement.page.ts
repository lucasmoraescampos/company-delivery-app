import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { ToastService } from '../../../services/toast/toast.service';
import { NumberHelper } from '../../../helpers/NumberHelper';
import { SubcomplementService } from 'src/app/services/subcomplement/subcomplement.service';

@Component({
  selector: 'app-add-subcomplement',
  templateUrl: './add-subcomplement.page.html',
  styleUrls: ['./add-subcomplement.page.scss'],
})
export class AddSubcomplementPage implements OnInit {

  public loading: boolean = false;

  public has_price: boolean = null;

  public info: boolean = false;

  public formGroupSubcomplement: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private toastSrv: ToastService,
    private subcomplementSrv: SubcomplementService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    const complement_id = this.navParams.get('complement_id');

    this.formGroupSubcomplement = this.formBuilder.group({
      complement_id: [complement_id, Validators.required],
      description: [null, Validators.required],
      price: [null]
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

        this.subcomplementSrv.create(subcomplement)
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
}
