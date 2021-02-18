import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { AlertService } from 'src/app/services/alert.service';
import { DeliveryPersonService } from 'src/app/services/delivery-person.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalDeliveryPersonComponent } from './modal-delivery-person/modal-delivery-person.component';
import { ModalSearchDeliveryPersonComponent } from './modal-search-delivery-person/modal-search-delivery-person.component';

@Component({
  selector: 'app-delivery-persons',
  templateUrl: './delivery-persons.page.html',
  styleUrls: ['./delivery-persons.page.scss'],
})
export class DeliveryPersonsPage implements OnInit, OnDestroy {

  public deliveryPersons: any[];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private loadingSrv: LoadingService,
    private alertSrv: AlertService,
    private deliveryPersonSrv: DeliveryPersonService
  ) { }

  ngOnInit() {

    this.prepareDelieryPersons();

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

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
          this.deleteDelieryPerson(deliveryPerson);
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
      component: ModalSearchDeliveryPersonComponent,
      backdropDismiss: false,
      cssClass: 'modal-lg',
      componentProps: {
        deliveryPersons: this.deliveryPersons
      }
    });

    return await modal.present();

  }

  public async modalDeliveryPerson(deliveryPerson?: any) {

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

          if (deliveryPerson) {

            const index = ArrayHelper.getIndexByKey(this.deliveryPersons, 'id', deliveryPerson.id);

            this.deliveryPersons[index] = res.data;

            this.deliveryPersons = ArrayHelper.orderbyAsc(this.deliveryPersons, 'name');

          }

          else {

            this.deliveryPersons.push(res.data);

            this.deliveryPersons = ArrayHelper.orderbyAsc(this.deliveryPersons, 'name');

          }

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

        this.loadingSrv.show();

        this.deliveryPersonSrv.update(deliveryPerson.id, formData)
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

              const index = ArrayHelper.getIndexByKey(this.deliveryPersons, 'id', deliveryPerson.id);

              this.deliveryPersons[index] = res.data;

            }

          });

      }

    });

  }

  private deleteDelieryPerson(deliveryPerson: any) {

    this.alertSrv.show({
      icon: 'question',
      message: `Excluir ${deliveryPerson.name}?`,
      confirmButtonText: 'Excluir',
      onConfirm: () => {

        this.loadingSrv.show();

        this.deliveryPersonSrv.delete(deliveryPerson.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loadingSrv.hide();

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

  private prepareDelieryPersons() {
    this.loadingSrv.show();
    this.deliveryPersonSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loadingSrv.hide();
        if (res.success) {
          this.deliveryPersons = res.data;
        }
      });
  }
  
}
