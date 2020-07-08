import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast/toast.service';
import { MenuSessionService } from 'src/app/services/menu-session/menu-session.service';

@Component({
  selector: 'app-change-session',
  templateUrl: './change-session.page.html',
  styleUrls: ['./change-session.page.scss'],
})
export class ChangeSessionPage implements OnInit {

  public session: any;

  public loading: boolean = false;

  public formGroupSession: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private toastSrv: ToastService,
    private menuSessionSrv: MenuSessionService,
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

      this.loading = true;

      this.menuSessionSrv.update(this.session.id, this.formGroupSession.value)
        .subscribe(res => {

          this.loading = false;

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
