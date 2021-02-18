import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController, NavParams } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { StringHelper } from 'src/app/helpers/string.helper';
import { AlertService } from 'src/app/services/alert.service';
import { DeliveryPersonService } from 'src/app/services/delivery-person.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalDeliveryPersonComponent } from '../modal-delivery-person/modal-delivery-person.component';

@Component({
  selector: 'app-modal-search-delivery-person',
  templateUrl: './modal-search-delivery-person.component.html',
  styleUrls: ['./modal-search-delivery-person.component.scss'],
})
export class ModalSearchDeliveryPersonComponent implements OnInit {

  public loading: boolean;

  public deliveryPersons: any[];

  public results: any[];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertSrv: AlertService,
    private deliveryPersonSrv: DeliveryPersonService,
    private navParams: NavParams
  ) { }

  ngOnInit() {

    this.deliveryPersons = this.navParams.get('deliveryPersons');

    this.results = this.deliveryPersons;

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

      this.deliveryPersons.forEach(deliveryPerson => {

        let name = StringHelper.normalize(deliveryPerson.name);

        if (name.match(new RegExp(search, 'gi'))) {

          this.results.push(deliveryPerson);

        }

      });

    }

    else {

      this.results = this.deliveryPersons;

    }

  }

  public async options(deliveryPerson: any) {

    const actionSheet = await this.actionSheetCtrl.create({
      header: deliveryPerson.name,
      buttons: [{
        text: deliveryPerson.status ? 'Inativar' : 'Ativar',
        handler: () => {
          this.updateStatus(deliveryPerson);
        }
      }, {
        text: 'Editar',
        handler: () => {
          this.modalDeliveryPerson(deliveryPerson);
        }
      }, {
        text: 'Excluir',
        handler: () => {
          this.deleteDeliveryPerson(deliveryPerson);
        }
      }, {
        text: 'Cancelar',
        role: 'cancel'
      }]
    });

    await actionSheet.present();

  }

  public async modalDeliveryPerson(deliveryPerson: any) {

    const modal = await this.modalCtrl.create({
      component: ModalDeliveryPersonComponent,
      backdropDismiss: false,
      componentProps: {
        deliveryPerson: deliveryPerson
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data) {

          const index = ArrayHelper.getIndexByKey(this.deliveryPersons, 'id', deliveryPerson.id);

          this.deliveryPersons[index] = res.data;

          this.deliveryPersons = ArrayHelper.orderbyAsc(this.deliveryPersons, 'name');

        }

      });

    return await modal.present();

  }

  private updateStatus(deliveryPerson: any) {

    const action = deliveryPerson.status ? 'Inativar' : 'Ativar';

    const formData = new FormData();

    formData.append('status', deliveryPerson.status ? '0' : '1');

    this.alertSrv.show({
      icon: 'question',
      message: `${action} ${deliveryPerson.name}?`,
      confirmButtonText: action,
      onConfirm: () => {

        this.loading = true;

        this.deliveryPersonSrv.update(deliveryPerson.id, formData)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

            if (res.success) {

              let message: string;

              if (res.data.status) {
                message = 'Entregador ativado com sucesso';
              }

              else {
                message = 'Entregador inativado com sucesso';
              }

              this.alertSrv.toast({
                icon: 'success',
                message: message
              });

              const index = ArrayHelper.getIndexByKey(this.deliveryPersons, 'id', deliveryPerson.id);

              this.deliveryPersons[index] = res.data;

            }

          });

      }

    });

  }

  private deleteDeliveryPerson(deliveryPerson: any) {

    this.alertSrv.show({
      icon: 'question',
      message: `Excluir ${deliveryPerson.name}?`,
      confirmButtonText: 'Excluir',
      onConfirm: () => {

        this.loading = true;

        this.deliveryPersonSrv.delete(deliveryPerson.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

            if (res.success) {

              this.alertSrv.toast({
                icon: 'success',
                message: res.message
              });

              const index = ArrayHelper.getIndexByKey(this.deliveryPersons, 'id', deliveryPerson.id);

              this.deliveryPersons = ArrayHelper.removeItem(this.deliveryPersons, index);

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
