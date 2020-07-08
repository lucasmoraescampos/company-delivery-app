import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { ToastService } from '../../../services/toast/toast.service';
import { ModalController } from '@ionic/angular';
import { MenuSessionService } from 'src/app/services/menu-session/menu-session.service';

@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.page.html',
  styleUrls: ['./add-session.page.scss'],
})
export class AddSessionPage implements OnInit {

  public loading: boolean = false;

  public formGroupSession: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastSrv: ToastService,
    private menuSession: MenuSessionService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

    this.formGroupSession = this.formBuilder.group({
      name: [null, Validators.required]
    });

  }

  public add() {

    if (this.formGroupSession.valid) {

      this.loading = true;

      this.menuSession.create(this.formGroupSession.value)
        .subscribe(res => {

          this.loading = false;

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
