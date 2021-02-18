import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController, NavParams } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { StringHelper } from 'src/app/helpers/string.helper';
import { AlertService } from 'src/app/services/alert.service';
import { AttendantService } from 'src/app/services/attendant.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalAttendantComponent } from '../modal-attendant/modal-attendant.component';

@Component({
  selector: 'app-modal-search-attendant',
  templateUrl: './modal-search-attendant.component.html',
  styleUrls: ['./modal-search-attendant.component.scss'],
})
export class ModalSearchAttendantComponent implements OnInit {

  public loading: boolean;

  public attendants: any[];

  public results: any[];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertSrv: AlertService,
    private attendantSrv: AttendantService,
    private navParams: NavParams
  ) { }

  ngOnInit() {

    this.attendants = this.navParams.get('attendants');

    this.results = this.attendants;

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public changedSearch(event: CustomEvent) {

    const search = StringHelper.normalize(event.detail.value);

    if (search.length > 0) {

      this.results = [];

      this.attendants.forEach(attendant => {

        let name = StringHelper.normalize(attendant.name);

        if (name.match(new RegExp(search, 'gi'))) {

          this.results.push(attendant);

        }

      });

    }

    else {

      this.results = this.attendants;

    }

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

  public async modalAttendant(attendant: any) {

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

          const index = ArrayHelper.getIndexByKey(this.attendants, 'id', attendant.id);

          this.attendants[index] = res.data;

          this.attendants = ArrayHelper.orderbyAsc(this.attendants, 'name');

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

        this.loading = true;

        this.attendantSrv.update(attendant.id, formData)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

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

        this.loading = true;

        this.attendantSrv.delete(attendant.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

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

}
