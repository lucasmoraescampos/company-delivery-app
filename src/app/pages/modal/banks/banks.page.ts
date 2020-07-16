import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BankService } from 'src/app/services/bank/bank.service';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.page.html',
  styleUrls: ['./banks.page.scss'],
})
export class BanksPage implements OnInit {

  public loading: boolean = false;

  public search: string;

  public banks: any;

  public results: any;

  constructor(
    private modalCtrl: ModalController,
    private bankSrv: BankService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {

    this.prepareBanks();

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public select(bank: any) {
    this.modalCtrl.dismiss(`${bank.code} - ${bank.name}`);
  }

  public doSearch() {

    if (this.search && this.search.length > 0) {

      this.ngZone.run(() => {

        this.loading = true;

        const search = this.normalize(this.search);

        this.results = [];

        this.banks.forEach(bank => {

          const name = this.normalize(`${bank.code} - ${bank.name}`);

          if (name.match(new RegExp(search, 'gi'))) {

            this.results.push(bank);

          }

        });

        this.results = ArrayHelper.orderbyAsc(this.results, 'id');

        this.loading = false;

      });

    }

    else {

      this.results = this.banks;

    }

  }

  private normalize(str: string) {
    const map = {
      'a': 'á|à|ã|â|À|Á|Ã|Â',
      'e': 'é|è|ê|É|È|Ê',
      'i': 'í|ì|î|Í|Ì|Î',
      'o': 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
      'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
      'c': 'ç|Ç',
      'n': 'ñ|Ñ'
    };

    str = str.toLowerCase();

    for (let pattern in map) {
      str = str.replace(new RegExp(map[pattern], 'g'), pattern);
    };

    return str;
  }

  private prepareBanks() {

    this.loading = true;

    this.bankSrv.get()
      .subscribe(res => {

        this.loading = false;

        if (res.success) {

          this.banks = res.data;

          this.results = res.data;

        }

      });

  }
}
