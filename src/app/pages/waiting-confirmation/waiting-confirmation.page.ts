import { Component, OnInit } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';
import { CompanyService } from 'src/app/services/company/company.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-waiting-confirmation',
  templateUrl: './waiting-confirmation.page.html',
  styleUrls: ['./waiting-confirmation.page.scss'],
})
export class WaitingConfirmationPage implements OnInit {

  public socket: WebSocketSubject<any>;

  constructor(
    private navCtrl: NavController,
    private companySrv: CompanyService
  ) { }

  ngOnInit() {

    this.prepareSocket();

  }

  private prepareSocket() {

    const company_id = CompanyService.auth().id;

    this.socket = webSocket(`${ConfigHelper.Socket}/company/confirmation?id=${company_id}`);

    this.socket.subscribe(data => {

      if (data.status == 1) {

        this.companySrv.confirmation();

        this.navCtrl.navigateRoot('/tabs/home');

      }

    });

  }

}
