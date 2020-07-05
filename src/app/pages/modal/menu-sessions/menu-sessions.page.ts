import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalController, NavParams, IonReorderGroup, PopoverController } from '@ionic/angular';
import { ProductService } from '../../../services/product/product.service';
import { ChangeSessionPage } from '../change-session/change-session.page';
import { ArrayHelper } from '../../../helpers/ArrayHelper';
import { ToastService } from '../../../services/toast/toast.service';
import { AlertService } from '../../../services/alert/alert.service';
import { SessionHelpPage } from '../../popover/session-help/session-help.page';

@Component({
  selector: 'app-menu-sessions',
  templateUrl: './menu-sessions.page.html',
  styleUrls: ['./menu-sessions.page.scss'],
})
export class MenuSessionsPage implements OnInit, OnDestroy {

  @ViewChild(IonReorderGroup, { static: true }) reorderGroup: IonReorderGroup;

  public sessions: Array<any>;

  public loading: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private productSrv: ProductService,
    private navParams: NavParams,
    private alertSrv: AlertService,
    private ToastSrv: ToastService,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    this.sessions = this.navParams.get('sessions');
  }

  ngOnDestroy() {
    this.productSrv.sessionsReorder(this.sessions).subscribe();
  }

  public async help(ev: any) {

    const popover = await this.popoverCtrl.create({
      component: SessionHelpPage,
      event: ev,
      translucent: true,
      cssClass: 'popover-custom',
      mode: 'ios'
    });

    return await popover.present();

  }

  // public help() {

  //   this.alertSrv.info(HtmlHelper.MenuSessionsInfo);

  // }

  public dismiss() {
    this.modalCtrl.dismiss(this.sessions);
  }

  public reorder(ev: any) {

    this.sessions = ev.detail.complete(this.sessions);

  }

  public async change(session: any) {

    const modal = await this.modalCtrl.create({
      component: ChangeSessionPage,
      cssClass: 'modal-custom',
      componentProps: {
        session: session
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          const index = ArrayHelper.getIndexByKey(this.sessions, 'id', res.data.id);

          this.sessions[index] = res.data;

        }

      });

    return await modal.present();

  }

  public remove(session_id: number) {

    this.alertSrv.confirm('Apagar esta sessão?', () => {

      this.loading = true;

      this.productSrv.deleteSession(session_id)
        .subscribe(res => {

          this.loading = false;

          if (res.success) {

            const index = ArrayHelper.getIndexByKey(this.sessions, 'id', session_id);

            this.sessions = ArrayHelper.removeItem(this.sessions, index);

            this.ToastSrv.success(res.message);

          }

          else {
            this.ToastSrv.error(res.message);
          }

        });

    });

  }

}
