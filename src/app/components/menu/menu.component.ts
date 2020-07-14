import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  public company: any;

  constructor(
    private companySrv: CompanyService,
    private navCtrl: NavController,
    private loadingSrv: LoadingService
  ) { }

  ngOnInit() {

    this.companySrv.currentUser.subscribe(company => {
      this.company = company;
    });

  }

  public settings() {
    this.navCtrl.navigateForward('/settings');
  }

  public location() {
    this.navCtrl.navigateForward('/location');
  }

  public delivers() {
    this.navCtrl.navigateForward('/delivers');
  }

  public logout() {

    this.loadingSrv.show();

    this.companySrv.logout()
      .subscribe(res => {

        this.loadingSrv.hide();

        this.navCtrl.navigateRoot('/welcome');
        
      });
  }
}
