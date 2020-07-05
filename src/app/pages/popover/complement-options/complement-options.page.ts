import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-complement-options',
  templateUrl: './complement-options.page.html',
  styleUrls: ['./complement-options.page.scss'],
})
export class ComplementOptionsPage implements OnInit {

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  public add() {
    this.popoverCtrl.dismiss('add_subcomplement');
  }

  public change() {
    this.popoverCtrl.dismiss('change_complement');
  }

  public delete() {
    this.popoverCtrl.dismiss('delete_complement');
  }
}
