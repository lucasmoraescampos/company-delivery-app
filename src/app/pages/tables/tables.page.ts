import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { TableService } from 'src/app/services/table.service';
import { ModalTableComponent } from './modal-table/modal-table.component';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.page.html',
  styleUrls: ['./tables.page.scss'],
})
export class TablesPage implements OnInit {

  public tables: any[];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private loadingSrv: LoadingService,
    private tableSrv: TableService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.prepareTables();

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  public async options(table: any) {

    const actionSheet = await this.actionSheetCtrl.create({
      header: table.name,
      buttons: [{
        text: 'Detalhes',
        handler: () => {
          this.navCtrl.navigateForward(['/table', table.id]);
        }
      }, {
        text: table.status ? 'Inativar' : 'Ativar',
        handler: () => {
          this.updateStatus(table);
        }
      }, {
        text: 'Editar',
        handler: () => {
          this.modalTable(table);
        }
      }, {
        text: 'Excluir',
        handler: () => {
          this.deleteTable(table);
        }
      }, {
        text: 'Cancelar',
        role: 'cancel'
      }]
    });

    await actionSheet.present();

  }

  public async modalTable(table?: any) {

    const modal = await this.modalCtrl.create({
      component: ModalTableComponent,
      backdropDismiss: false,
      cssClass: 'modal-sm',
      componentProps: {
        table: table
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data) {

          if (table) {

            const index = ArrayHelper.getIndexByKey(this.tables, 'id', table.id);

            this.tables[index] = res.data;

          }

          else {

            this.tables.push(res.data);

          }

        }

      });

    return await modal.present();

  }

  private updateStatus(table: any) {

    const action = table.status ? 'Inativar' : 'Ativar';

    this.alertSrv.show({
      icon: 'question',
      message: `${action} ${table.name}?`,
      confirmButtonText: action,
      onConfirm: () => {

        this.loadingSrv.show();

        this.tableSrv.update(table.id, { status: !table.status })
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loadingSrv.hide();

            if (res.success) {

              let message: string;

              if (res.data.status) {
                message = 'Mesa ativada com sucesso';
              }

              else {
                message = 'Mesa inativada com sucesso';
              }

              this.alertSrv.toast({
                icon: 'success',
                message: message
              });

              const index = ArrayHelper.getIndexByKey(this.tables, 'id', table.id);

              this.tables[index] = res.data;

            }

          });

      }

    });

  }

  private deleteTable(table: any) {

    this.alertSrv.show({
      icon: 'question',
      message: `Excluir a mesa ${table.name}?`,
      confirmButtonText: 'Excluir',
      onConfirm: () => {
        
        this.loadingSrv.show();

        this.tableSrv.delete(table.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loadingSrv.hide();

            if (res.success) {

              const index = ArrayHelper.getIndexByKey(this.tables, 'id', table.id);
              
              this.tables = ArrayHelper.removeItem(this.tables, index);

              this.alertSrv.toast({
                icon: 'success',
                message: res.message
              });

            }

          });

      }
    });
    
  }

  private prepareTables() {
    this.loadingSrv.show();
    this.tableSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loadingSrv.hide();
        if (res.success) {
          this.tables = res.data;
        }
      });
  }

}
