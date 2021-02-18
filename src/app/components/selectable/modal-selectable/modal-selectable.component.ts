import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ArrayHelper } from 'src/app/helpers/array.helper';

@Component({
  selector: 'app-modal-selectable',
  templateUrl: './modal-selectable.component.html',
  styleUrls: ['./modal-selectable.component.scss'],
})
export class ModalSelectableComponent implements OnInit {

  public loading: boolean;

  public search: string;

  public label: string;

  public value: any;

  public data: any[];

  public results: any[];

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {

    this.loading = true;

    this.value = this.navParams.get('value');

    this.data = this.navParams.get('data');

    this.label = this.navParams.get('label');
    
  }

  async ionViewDidEnter() {

    this.results = this.data;

    this.loading = false;

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public async searchChanged() {

    if (this.search && this.search.length > 0) {

      const search = this.normalize(String(this.search));

      this.results = [];

      this.data.forEach(data => {

        const label = this.normalize(String(data[this.label]));

        if (label.match(new RegExp(search, 'gi'))) {

          this.results.push(data);

        }

      });

      this.results = ArrayHelper.orderbyAsc(this.results, this.label);

    }

    else {

      this.results = this.data;

    }

  }

  public confirm() {

    this.modalCtrl.dismiss(this.value);

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

}
