import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-modal-share-link',
  templateUrl: './modal-share-link.component.html',
  styleUrls: ['./modal-share-link.component.scss'],
})
export class ModalShareLinkComponent implements OnInit, OnDestroy {

  public loading: boolean;

  public company: any;

  public slug: string;

  public error: string | false;

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private apiSrv: ApiService,
    private companySrv: CompanyService
  ) { }

  ngOnInit() {
    this.slug = this.company.slug
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public changeSlug(event: any) {

    if (this.slug.length == 0) {
      this.error = 'Informe o nome de usuário.';
    }

    else if (this.slug == this.company.slug) {
      this.error = false;
    }

    else if (/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/.test(this.slug)) {

      this.apiSrv.checkDuplicity({ slug: event.detail.value })
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(res => {
          if (!res.success) {
            this.error = 'Este nome de usuário já está sendo usado.';
          }
          else {
            this.error = false;
          }
        });

    }

    else {
      this.error = 'Nome de usuário inválido.';
    }

  }

  public save() {
    this.loading = true;
    this.companySrv.update(this.company.id, { slug: this.slug })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        if (res.success) {
          this.modalCtrl.dismiss(res.data.slug);
        }
      });
  }
}
