import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { mergeMapTo, takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { CompanyService } from 'src/app/services/company.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PermissionType, Plugins } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { FcmTokenService } from 'src/app/services/fcm-token.service';

const { Browser, Clipboard, Permissions } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  public company: any;

  public siteUrl: string = environment.siteUrl;

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
    private alertSrv: AlertService,
    private afMessaging: AngularFireMessaging,
    private fcmTokenSrv: FcmTokenService
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

    this.requestNotificationPermission();

  }

  public onSelect(event) {
    console.log(event);
  }

  public changeOpen(event: CustomEvent) {

    const open = event.detail.checked;

    if (this.company.open != open) {

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
          text: 'Abrir link',
          icon: 'open-outline',
          callback: () => {
            Browser.open({ url: this.siteUrl + '/' + this.company.slug });
          }
        },
        {
          text: 'Copiar link',
          icon: 'copy-outline',
          callback: () => {
            Clipboard.write({
              string: this.siteUrl + '/' + this.company.slug
            });

            this.alertSrv.toast({
              icon: 'success',
              message: 'Link copiado com sucesso'
            });
          }
        }
      ]
    });
  }

  private requestNotificationPermission() {

    Permissions.query({ name: PermissionType.Notifications })
      .then(res => {

        if (res.state == 'prompt') {

          this.alertSrv.custom({
            imageUrl: './assets/icon/push-notification.svg',
            title: 'Notificações',
            message: 'Você deve permitir que enviemos notificações para o seu dispositivo.',
            confirmButtonText: 'Ok, Permitir',
            onConfirm: () => {

              this.afMessaging.requestPermission
                .pipe(takeUntil(this.unsubscribe))
                .pipe(mergeMapTo(this.afMessaging.tokenChanges))
                .subscribe(
                  (token) => {

                    this.fcmTokenSrv.checkInFcmTokenWithAuth(token)
                      .pipe(takeUntil(this.unsubscribe))
                      .subscribe();

                  },
                  (error) => {

                    this.alertSrv.custom({
                      imageUrl: './assets/icon/denied.svg',
                      message: 'Não obtemos permissão para enviar notificações ao seu dispositivo. Vá em configurações e permita que enviemos nnotificações para que você tenha todas as informações necessárias em tempo real.',
                      confirmButtonText: 'Ok, Entendi'
                    });

                  }
                );

            }
          });

        }

        else if (res.state == 'denied') {

          this.alertSrv.custom({
            imageUrl: './assets/icon/denied.svg',
            message: 'Não obtemos permissão para enviar notificações ao seu dispositivo. Vá em configurações e permita que enviemos nnotificações para que você tenha todas as informações necessárias em tempo real.',
            confirmButtonText: 'Ok, Entendi'
          });

        }

        else {

          this.afMessaging.getToken
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((token) => {

              this.fcmTokenSrv.checkInFcmTokenWithAuth(token)
                .pipe(takeUntil(this.unsubscribe))
                .subscribe();

            });

        }

      });

  }

  private initCompany() {
    this.companySrv.currentCompany.pipe(takeUntil(this.unsubscribe))
      .subscribe(company => {
        this.company = company
      });
  }
}
