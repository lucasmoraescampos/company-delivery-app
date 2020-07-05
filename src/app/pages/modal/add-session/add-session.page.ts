import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { ToastService } from '../../../services/toast/toast.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.page.html',
  styleUrls: ['./add-session.page.scss'],
})
export class AddSessionPage implements OnInit {

  public spinner: boolean = false;

  public formGroupSession: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastSrv: ToastService,
    private productSrv: ProductService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

    this.formGroupSession = this.formBuilder.group({
      name: [null, Validators.required]
    });

  }

  public add() {

    if (this.formGroupSession.valid) {

      this.spinner = true;

      this.productSrv.createSession(this.formGroupSession.value)
        .subscribe(res => {

          this.spinner = false;

          if (res.success) {

            this.toastSrv.success(res.message);

            this.modalCtrl.dismiss(res.data);
            
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
    this.modalCtrl.dismiss();
  }

}
