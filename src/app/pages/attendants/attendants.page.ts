import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { AlertService } from 'src/app/services/alert.service';
import { AttendantService } from 'src/app/services/attendant.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalAttendantComponent } from './modal-attendant/modal-attendant.component';
import { ModalSearchAttendantComponent } from './modal-search-attendant/modal-search-attendant.component';

@Component({
  selector: 'app-attendants',
  templateUrl: './attendants.page.html',
  styleUrls: ['./attendants.page.scss'],
})
export class AttendantsPage implements OnInit, OnDestroy {

  public attendants: any[];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private loadingSrv: LoadingService,
    private attendantSrv: AttendantService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.prepareAttendants();

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  public async options(attendant: any) {

    const actionSheet = await this.actionSheetCtrl.create({
      header: attendant.name,
      buttons: [{
        text: attendant.status ? 'Inativar' : 'Ativar',
        handler: () => {
          this.updateStatus(attendant);
        }
      }, {
        text: 'Editar',
        handler: () => {
          this.modalAttendant(attendant);
        }
      }, {
        text: 'Excluir',
        handler: () => {
          this.deleteAttendant(attendant);
        }
      }, {
        text: 'Cancelar',
        role: 'cancel'
      }]
    });

    await actionSheet.present();

  }

  public async modalSearch() {

    const modal = await this.modalCtrl.create({
      component: ModalSearchAttendantComponent,
      backdropDismiss: false,
      cssClass: 'modal-lg',
      componentProps: {
        attendants: this.attendants
      }
    });

    return await modal.present();

  }

  public async modalAttendant(attendant?: any) {

    const modal = await this.modalCtrl.create({
      component: ModalAttendantComponent,
      backdropDismiss: false,
      componentProps: {
        attendant: attendant
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data) {

          if (attendant) {

            const index = ArrayHelper.getIndexByKey(this.attendants, 'id', attendant.id);

            this.attendants[index] = res.data;

            this.attendants = ArrayHelper.orderbyAsc(this.attendants, 'name');

          }

          else {

            this.attendants.push(res.data);

            this.attendants = ArrayHelper.orderbyAsc(this.attendants, 'name');

          }

        }

      });

    return await modal.present();

  }

  private updateStatus(attendant: any) {

    const action = attendant.status ? 'Inativar' : 'Ativar';

    const formData = new FormData();

    formData.append('status', attendant.status ? '0' : '1');

    this.alertSrv.show({
      icon: 'question',
      message: `${action} ${attendant.name}?`,
      confirmButtonText: action,
      onConfirm: () => {

        this.loadingSrv.show();

        this.attendantSrv.update(attendant.id, formData)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loadingSrv.hide();

            if (res.success) {

              let message: string;

              if (res.data.status) {
                message = 'Atendente ativado com sucesso';
              }

              else {
                message = 'Atendente inativado com sucesso';
              }

              this.alertSrv.toast({
                icon: 'success',
                message: message
              });

              const index = ArrayHelper.getIndexByKey(this.attendants, 'id', attendant.id);

              this.attendants[index] = res.data;

            }

          });

      }

    });

  }

  private deleteAttendant(attendant: any) {

    this.alertSrv.show({
      icon: 'question',
      message: `Excluir ${attendant.name}?`,
      confirmButtonText: 'Excluir',
      onConfirm: () => {

        this.loadingSrv.show();

        this.attendantSrv.delete(attendant.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loadingSrv.hide();

            if (res.success) {

              this.alertSrv.toast({
                icon: 'success',
                message: res.message
              });

              const index = ArrayHelper.getIndexByKey(this.attendants, 'id', attendant.id);

              this.attendants = ArrayHelper.removeItem(this.attendants, index);

            }

            else {

              this.alertSrv.toast({
                icon: 'error',
                message: res.message
              });

            }

          });

      }

    });

  }

  private prepareAttendants() {
    this.loadingSrv.show();
    this.attendantSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loadingSrv.hide();
        if (res.success) {
          this.attendants = res.data;
        }
      });
  }

}
