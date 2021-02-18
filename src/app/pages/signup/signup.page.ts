import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, MenuController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ValidatorsHelper } from 'src/app/helpers/validators.helper';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject();

  public submitAttempt: boolean = false;

  public formGroup: FormGroup;

  constructor(
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private userSrv: UserService,
    private loadingSrv: LoadingService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.menuCtrl.enable(false);

    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(14)]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: ValidatorsHelper.mustMatch('password', 'confirmPassword')
    });

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  public signin() {
    this.navCtrl.navigateRoot('/signin', { animationDirection: 'forward' });
  }

  public get formControl() {
    return this.formGroup.controls;
  }

  public onEnter(nextInput?: IonInput) {

    if (nextInput != undefined) {

      nextInput.setFocus();

    }

    else {

      this.save();

    }

  }

  public save() {

    this.submitAttempt = true;
    
    if (this.formGroup.valid) {

      this.loadingSrv.show();

      const data = {
        name: this.formControl.name.value.trim(),
        surname: this.formControl.surname.value.trim(),
        email: this.formControl.email.value,
        phone: this.formControl.phone.value.replace(/[^0-9]/g, ''),
        password: this.formControl.password.value
      }

      this.userSrv.create(data)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            this.navCtrl.navigateRoot('/companies', {
              animationDirection: 'forward'
            });

            this.menuCtrl.enable(false);
            
          }

          else {

            this.alertSrv.toast({
              icon: 'error',
              message: res.message
            });

          }

        });

    }
    
  }

}
