import { Component, OnInit } from '@angular/core';
import { ModalController,  PopoverController } from '@ionic/angular';
import { ChangeSessionPage } from '../change-session/change-session.page';
import { ArrayHelper } from '../../../helpers/ArrayHelper';
import { ToastService } from '../../../services/toast/toast.service';
import { AlertService } from '../../../services/alert/alert.service';
import { SessionHelpPage } from '../../popover/session-help/session-help.page';
import { MenuSessionService } from 'src/app/services/menu-session/menu-session.service';

@Component({
  selector: 'app-menu-sessions',
  templateUrl: './menu-sessions.page.html',
  styleUrls: ['./menu-sessions.page.scss'],
})
export class MenuSessionsPage implements OnInit {

  public sessions: Array<any>;

  public loading: boolean = false;

  public enable_reorder: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private menuSessionSrv: MenuSessionService,
    private alertSrv: AlertService,
    private ToastSrv: ToastService,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {

    this.prepareSessions();

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

  public enableReorder() {
    this.enable_reorder = true;
  }

  public disableReorder() {
    this.enable_reorder = false;
  }

  public save() {

    this.loading = true;
  
    this.menuSessionSrv.reorder(this.sessions)
      .subscribe(res => {

        if (res.success) {

          this.loading = false;

          this.enable_reorder = false;

          this.ToastSrv.success(res.message);

        }

      });

  }

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

      this.menuSessionSrv.delete(session_id)
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

  private prepareSessions() {

    this.loading = true;

    this.menuSessionSrv.get()
      .subscribe(res => {

        if (res.success) {

          this.sessions = res.data;

        }

        this.loading = false;

      });
  }
}
