import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-modal-plans',
  templateUrl: './modal-plans.component.html',
  styleUrls: ['./modal-plans.component.scss'],
})
export class ModalPlansComponent implements OnInit, OnDestroy {

  public loading: boolean;

  public plans: any[];

  public selected: number;

  public company: any;

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private apiSrv: ApiService,
    private companySrv: CompanyService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.company = this.companySrv.getCurrentCompany();

    this.selected = this.company.plan_id;

    this.initPlans();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public save() {

    this.loading = true;

    const data = {
      category_id: this.company.category_id,
      plan_id: this.selected
    }

    this.companySrv.update(this.company.id, data)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loading = false;

        if (res.success) {

          this.alertSrv.toast({
            icon: 'success',
            message: res.message
          });

          this.modalCtrl.dismiss(res.data);

        }

      });

  }

  private initPlans() {
    this.loading = true;
    this.apiSrv.getPlans(this.company.category_id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        this.plans = res.data
      });
  }

}
