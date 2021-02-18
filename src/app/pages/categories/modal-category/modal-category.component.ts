import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { CategoryService } from 'src/app/services/category.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-modal-category',
  templateUrl: './modal-category.component.html',
  styleUrls: ['./modal-category.component.scss'],
})
export class ModalCategoryComponent implements OnInit, OnDestroy {

  public submitAttempt: boolean;

  public name: string;

  public category: any;

  public loading: boolean;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private categorySrv: CategoryService,
    private alertSrv: AlertService,
    private companySrv: CompanyService
  ) { }

  ngOnInit() {
    
    this.category = this.navParams.get('category');

    this.name = this.category ? this.category.name : '';

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public save() {

    this.submitAttempt = true;

    if (this.name.length > 0) {

      this.loading = true;

      if (this.category) {

        this.categorySrv.update(this.category.id, { name: this.name })
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
      
      else {

        this.categorySrv.create({ name: this.name })
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

    }

  }

}
