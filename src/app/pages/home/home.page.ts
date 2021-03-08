import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { CompanyService } from 'src/app/services/company.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Plugins } from '@capacitor/core';
import { ModalShareLinkComponent } from 'src/app/components/modal-share-link/modal-share-link.component';

const { Browser, Clipboard  } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  public company: any;

  private unsubscribe = new Subject();

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
    domain: ['var(--ion-color-primary)']
  };

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private companySrv: CompanyService,
    private loadingSrv: LoadingService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {
    this.initCompany();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ionViewDidEnter() {

    const chart: any = document.querySelector('.chart');

    this.view = [chart.offsetWidth - 32, 185];
    
  }
  
  public onSelect(event) {
    console.log(event);
  }

  public changeOpen(event: CustomEvent) {
    const open = event.detail.checked;
    this.loadingSrv.show();
    this.companySrv.update(this.company.id, { open })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loadingSrv.hide();
        this.company = res.data;
        this.companySrv.setCurrentCompany(this.company);
        this.alertSrv.toast({
          icon: 'success',
          message: this.company.open ? 'Empresa aberta com sucesso' : 'Empresa fechada com sucesso'
        });
      });
  }

  public share() {
    this.alertSrv.options({
      title: 'Compartilhar',
      buttons: [
        {
          text: 'Whatsapp',
          icon: 'logo-whatsapp',
          callback: () => {
            const link = 'https://meupedido.org/' + this.company.slug;
            const text = encodeURI(`Olá querido cliente! Para melhor atendê-lo criamos nosso canal de pedidos online! Acesse o site ${link} e faça seu pedido com facilidade e segurança. Muito Obrigado!`);
            Browser.open({ url: 'https://api.whatsapp.com/send?text=' + text });
          }
        },
        {
          text: 'Copiar link',
          icon: 'copy-outline',
          callback: () =>  {
            Clipboard.write({
              string: 'https://meupedido.org/' + this.company.slug
            });

            this.alertSrv.toast({
              icon: 'success',
              message: 'Link copiado com sucesso'
            });
          }
        },
        {
          text: 'Editar link',
          icon: 'create-outline',
          callback: () =>  {
            this.modalShareLink();
          }
        }
      ]
    });
  }

  private async modalShareLink() {

    const modal = await this.modalCtrl.create({
      component: ModalShareLinkComponent,
      backdropDismiss: false,
      componentProps: {
        company: this.company
      }
    });

    modal.onWillDismiss()
      .then(res => {
        if (res.data) {
          this.company.slug = res.data;
          this.companySrv.setCurrentCompany(this.company);
        }
      });

    return await modal.present();

  }

  private initCompany() {
    this.companySrv.currentCompany.pipe(takeUntil(this.unsubscribe))
      .subscribe(company => {
        this.company = company
      });
  }
}
