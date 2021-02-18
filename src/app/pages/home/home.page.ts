import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ModalOrderMenuComponent } from 'src/app/components/modal-order-menu/modal-order-menu.component';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  single: any[] = [
    {
      "name": "Quarta",
      "value": 8940000
    },
    {
      "name": "Quinta",
      "value": 5000000
    },
    {
      "name": "Sexta",
      "value": 7100000
    },
    {
      "name": "Sábado",
      "value": 720330
    },
    {
      "name": "Domingo",
      "value": 7200400
    },
    {
      "name": "Ontem",
      "value": 720400
    },
    {
      "name": "Hoje",
      "value": 7202000
    }
  ];

  multi: any[];

  view: any[];

  colorScheme = {
    domain: ['#e60506']
  };

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private companySrv: CompanyService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {

    const chart: any = document.querySelector('.chart-week');

    this.view = [chart.offsetWidth - 32, 150];
    
  }

  public async newOrder() {

    const modal = await this.modalCtrl.create({
      component: ModalOrderMenuComponent,
      backdropDismiss: false,
      cssClass: 'modal-lg'
    });

    return await modal.present();

  }

  public onSelect(event) {
    console.log(event);
  }

}
