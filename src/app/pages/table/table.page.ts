import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-table',
  templateUrl: './table.page.html',
  styleUrls: ['./table.page.scss'],
})
export class TablePage implements OnInit {

  public products: any[] = [
    {
      name: 'Açaí premium duplo 500ml',
      qty: 1,
      price: 15.00,
      complements: [
        { name: 'Hamburguer', qty: 1, price: 3.00 },
        { name: 'Hamburguer', qty: 1, price: 3.00 }
      ] 
    },
    {
      name: 'Açaí premium duplo 500ml',
      qty: 1,
      price: 15.00,
      complements: [
        { name: 'Hamburguer', qty: 1, price: 3.00 },
        { name: 'Hamburguer', qty: 1, price: 3.00 }
      ] 
    },
    {
      name: 'Açaí premium duplo 500ml',
      qty: 1,
      price: 13.00,
      complements: [] 
    }
  ];

  constructor(
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
  }

  public async options() {

    const actionSheet = await this.actionSheetCtrl.create({
      mode: 'md',
      header: 'Açai premium duplo 500ml',
      buttons: [{
        text: 'Finalizar pedido',
        icon: 'checkmark-circle-outline',
        handler: () => {


        }
      }, {
        text: 'Cancelar pedido',
        icon: 'close-circle-outline',
        handler: () => {


        }
      }, {
        text: 'Voltar',
        icon: 'arrow-back-circle-outline',
        role: 'cancel'
      }]
    });

    await actionSheet.present();

  }

}
