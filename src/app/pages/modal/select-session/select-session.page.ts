import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MenuSessionService } from 'src/app/services/menu-session/menu-session.service';
import { AddSessionPage } from '../add-session/add-session.page';

@Component({
  selector: 'app-select-session',
  templateUrl: './select-session.page.html',
  styleUrls: ['./select-session.page.scss'],
})
export class SelectSessionPage implements OnInit {

  public sessions: any;

  constructor(
    private modalCtrl: ModalController,
    private menuSessionSrv: MenuSessionService,
    
  ) { }

  ngOnInit() {

    this.prepareSessions();

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public select(session: any) {
    this.modalCtrl.dismiss(session);
  }

  public async add() {

    const modal = await this.modalCtrl.create({
      component: AddSessionPage,
      cssClass: 'modal-custom',
      backdropDismiss: false
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          this.sessions.push(res.data);

        }

      });

    return await modal.present();

  }

  private prepareSessions() {
    this.menuSessionSrv.get()
      .subscribe(res => {
        if (res.success) {
          this.sessions = res.data;
        }
      });
  }

}
