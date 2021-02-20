import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { CompanyService } from 'src/app/services/company.service';
import { SegmentService } from 'src/app/services/segment.service';

@Component({
  selector: 'app-modal-segment',
  templateUrl: './modal-segment.component.html',
  styleUrls: ['./modal-segment.component.scss'],
})
export class ModalSegmentComponent implements OnInit {

  public submitAttempt: boolean;

  public name: string;

  public segment: any;

  public loading: boolean;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private segmentSrv: SegmentService,
    private alertSrv: AlertService,
    private companySrv: CompanyService
  ) { }

  ngOnInit() {
    
    this.segment = this.navParams.get('segment');

    this.name = this.segment ? this.segment.name : '';

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

      if (this.segment) {

        this.segmentSrv.update(this.segment.id, { name: this.name })
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

        this.segmentSrv.create({ name: this.name })
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
