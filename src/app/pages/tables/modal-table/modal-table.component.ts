import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-modal-table',
  templateUrl: './modal-table.component.html',
  styleUrls: ['./modal-table.component.scss'],
})
export class ModalTableComponent implements OnInit, OnDestroy {

  public loading: boolean;

  public submitAttempt: boolean;

  public name: string;

  public table: any;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private tableSrv: TableService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.table = this.navParams.get('table');

    this.name = this.table ? this.table.name : '';

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

      if (this.table) {

        const id = this.table.id;

        this.tableSrv.update(id, { name: this.name })
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

        this.tableSrv.create({ name: this.name })
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
