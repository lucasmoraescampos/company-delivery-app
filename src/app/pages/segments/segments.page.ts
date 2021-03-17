import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SegmentService } from 'src/app/services/segment.service';
import { ItemReorderEventDetail } from '@ionic/core';
import { ModalSegmentComponent } from 'src/app/components/modal-segment/modal-segment.component';
@Component({
  selector: 'app-segments',
  templateUrl: './segments.page.html',
  styleUrls: ['./segments.page.scss'],
})
export class SegmentsPage implements OnInit {

  public reorder: boolean;

  public segments: any[];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private segmentSrv: SegmentService,
    private loadingSrv: LoadingService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.initSegments();

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  ionViewWillEnter() {
    this.reorder = false;
  }

  public doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.segments = ev.detail.complete(this.segments);
  }

  public options(segment: any) {

    this.alertSrv.options({
      title: segment.name,
      buttons: [
        {
          text: 'Editar',
          icon: 'create-outline',
          callback: () => {
            this.modalSegment(segment);
          }
        },
        {
          text: 'Excluir',
          icon: 'trash-outline',
          callback: () =>  {
            this.deleteSegment(segment);
          }
        },
        {
          text: 'Reordenar',
          icon: 'swap-vertical-outline',
          callback: () =>  {
            this.reorder = true;
          }
        }
      ]
    });

  }

  public async modalSegment(segment?: any) {

    const modal = await this.modalCtrl.create({
      component: ModalSegmentComponent,
      backdropDismiss: false,
      cssClass: 'modal-sm',
      componentProps: {
        segment: segment
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data) {

          if (segment) {

            const index = ArrayHelper.getIndexByKey(this.segments, 'id', segment.id);

            this.segments[index] = res.data;

          }

          else {

            this.segments.push(res.data);

          }

        }

      });

    return await modal.present();

  }

  public save() {
    this.loadingSrv.show();
    this.segmentSrv.reorder({ segments: this.segments })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loadingSrv.hide();
        this.reorder = false;
        if (res.success) {
          this.segments = res.data;
          this.alertSrv.toast({
            icon: 'success',
            message: res.message
          });
        }
      });
  }

  private deleteSegment(segment: any) {
    this.alertSrv.show({
      icon: 'warning',
      message: `Você está prestes a excluir a categoria "${segment.name}"`,
      confirmButtonText: 'Excluir',
      onConfirm: () => {
        
        this.loadingSrv.show();

        this.segmentSrv.delete(segment.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loadingSrv.hide();

            if (res.success) {

              const index = ArrayHelper.getIndexByKey(this.segments, 'id', segment.id);
              
              this.segments = ArrayHelper.removeItem(this.segments, index);

              this.alertSrv.toast({
                icon: 'success',
                message: res.message
              });

            }

            else {

              this.alertSrv.toast({
                icon: 'error',
                message: res.message,
                duration: 6000
              });

            }

          });

      }
    });
  }

  private initSegments() {
    this.loadingSrv.show();
    this.segmentSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loadingSrv.hide();
        if (res.success) {
          this.segments = res.data;
        }
      });
  }
}
