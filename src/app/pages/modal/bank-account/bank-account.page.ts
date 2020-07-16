import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BanksPage } from '../banks/banks.page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company/company.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.page.html',
  styleUrls: ['./bank-account.page.scss'],
})
export class BankAccountPage implements OnInit {

  public loading: boolean = false;

  public formGroupBank: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private toastSrv: ToastService,
    private companySrv: CompanyService
  ) { }

  ngOnInit() {

    const company = CompanyService.auth();

    this.formGroupBank = this.formBuilder.group({
      bank_name: [company.bank_name, Validators.required],
      bank_agency: [company.bank_agency, Validators.required],
      bank_type_account: [company.bank_type_account, Validators.required],
      bank_account: [company.bank_account, Validators.required],
      bank_holder_name: [company.bank_holder_name, Validators.required],
      bank_document_number: [company.bank_document_number, Validators.required]
    });

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public async banks() {

    const modal = await this.modalCtrl.create({
      component: BanksPage,
      cssClass: 'modal-custom',
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          this.formGroupBank.patchValue({
            bank_name: res.data
          });

        }

      });

    return await modal.present();

  }

  public save() {

    if (this.formGroupBank.valid) {

      this.loading = true;

      const data = this.formGroupBank.value;

      this.companySrv.update(data)
        .subscribe(res => {

          this.loading = false;

          if (res.success) {

            this.toastSrv.success('Conta bancária cadastrada com sucesso!');

            this.modalCtrl.dismiss(res.data);

          }

        });
      
    }

    else {

      this.toastSrv.error('Informe todos os dados!');

    }

  }
}
