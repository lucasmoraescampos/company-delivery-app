import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../services/loading/loading.service';
import { ToastService } from '../../../services/toast/toast.service';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-change-session',
  templateUrl: './change-session.page.html',
  styleUrls: ['./change-session.page.scss'],
})
export class ChangeSessionPage implements OnInit {

  public session: any;

  public spinner: boolean = false;

  public formGroupSession: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private toastSrv: ToastService,
    private productSrv: ProductService,
    private navParams: NavParams
  ) { }

  ngOnInit() {

    this.session = this.navParams.get('session');

    this.formGroupSession = this.formBuilder.group({
      name: [this.session.name, Validators.required]
    });

  }

  public update() {

    if (this.formGroupSession.valid) {

      this.spinner = true;

      this.productSrv.updateSession(this.session.id, this.formGroupSession.value)
        .subscribe(res => {

          this.spinner = false;

          if (res.success) {

            this.toastSrv.success(res.message);

            this.session.name = this.formGroupSession.value.name;

            this.dismiss();
            
          }
          else {
            this.toastSrv.error(res.message);
          }

        });

    }

    else {
      this.toastSrv.error('Informe o nome da sessão!');
    }

  }

  public dismiss() {
    this.modalCtrl.dismiss(this.session);
  }

}
