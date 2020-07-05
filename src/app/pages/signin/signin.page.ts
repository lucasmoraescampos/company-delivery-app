import { Component, OnInit } from '@angular/core';
import { IonInput, NavController } from '@ionic/angular';
import { CompanyService } from '../../services/company/company.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  public eye: boolean = false;

  public spinner: boolean = false;

  public formGroupLogin: FormGroup;

  constructor(
    private companySrv: CompanyService,
    private formBuilder: FormBuilder,
    private toastSrv: ToastService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {

    this.formGroupLogin = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });

  }

  public login() {

    if (this.formGroupLogin.valid) {

      this.spinner = true;

      const email = this.formGroupLogin.value.email;
      const password = this.formGroupLogin.value.password;

      this.companySrv.authenticate(email, password)
        .subscribe(res => {

          this.spinner = false;
          
          if (res.success) {
            this.navCtrl.navigateForward('tabs/home');
          }
          else {
            this.toastSrv.error(res.message);
          }
        });

    }

    else {
      this.toastSrv.error('Informe todos os dados!');
    }
  }

  public changeEye(input: IonInput) {
    input.setFocus();
    this.eye = this.eye == true ? false : true;
  }

}
