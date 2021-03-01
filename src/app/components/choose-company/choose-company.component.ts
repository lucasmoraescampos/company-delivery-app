import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverCompaniesComponent } from './popover-companies/popover-companies.component';

@Component({
  selector: 'app-choose-company',
  templateUrl: './choose-company.component.html',
  styleUrls: ['./choose-company.component.scss'],
})
export class ChooseCompanyComponent implements OnInit {

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {}

  public async companies(ev: any) {
    
    const popover = await this.popoverCtrl.create({
      component: PopoverCompaniesComponent,
      event: ev,
      cssClass: 'popover-companies'
    });

    return await popover.present();

  }

}
