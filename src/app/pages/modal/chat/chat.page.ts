import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  public scrollEvents: boolean = true;

  public date_header: string;

  private top: number;

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform
  ) {

    this.top = platform.height() - (platform.height() * 0.93);

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
  }

  public sessionScroll() {

    const dates = document.getElementsByClassName('dateHeader');

    const length = dates.length;

    for (let i = length - 1; i >= 0; i--) {

      if (dates.item(i).getBoundingClientRect().top <= this.top + 60) {

        this.date_header = dates.item(i).textContent;
        
        break;

      }

    }

  }

}
