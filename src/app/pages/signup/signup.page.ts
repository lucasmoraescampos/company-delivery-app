import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast/toast.service';
import { NavController, IonInput } from '@ionic/angular';
import { CompanyService } from 'src/app/services/company/company.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public eye: boolean = false;

  public spinner: boolean = false;

  public categories: Array<any>;

  public formGroupRegister: FormGroup;

  constructor(
    private navCtrl: NavController,
    private companySrv: CompanyService,
    private categorySrv: CategoryService,
    private toastSrv: ToastService,
    private loadingSrv: LoadingService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.prepareCategories();

    this.formGroupRegister = this.formBuilder.group({
      category_id: [null, Validators.required],
      name: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });

  }

  public send() {

    if (this.formGroupRegister.valid) {

      this.spinner = true;

      const company = this.formGroupRegister.value;

      this.companySrv.create(company)
        .subscribe(res => {

          this.spinner = false;

          if (res.success) {

            this.navCtrl.navigateRoot('/waiting-confirmation');

          }
          
          else {

            this.spinner = false;

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

  private prepareCategories() {

    this.loadingSrv.show();

    this.categorySrv.getAll()
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {
          this.categories = res.data;
        }
      });

  }

}
