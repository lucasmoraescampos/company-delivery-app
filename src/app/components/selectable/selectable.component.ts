import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalSelectableComponent } from './modal-selectable/modal-selectable.component';

@Component({
  selector: 'app-selectable',
  templateUrl: './selectable.component.html'
})
export class SelectableComponent implements OnInit {

  @Input() data: any[];

  @Input() label: string;

  @Input() value: any;

  @Input() invalid: boolean;
  
  @Input() disabled: boolean;

  @Output() changeSelectable = new EventEmitter();

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

  }

  public async options() {

    if (this.disabled) return;

    const modal = await this.modalCtrl.create({
      component: ModalSelectableComponent,
      cssClass: 'modal-custom',
      componentProps: {
        data: this.data,
        label: this.label,
        value: this.value
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data) {

          this.value = res.data;

          this.changeSelectable.emit(res.data);

        }

      });

    return await modal.present();

  }

}
