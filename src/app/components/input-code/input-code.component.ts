import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-input-code',
  templateUrl: './input-code.component.html',
  styleUrls: ['./input-code.component.scss'],
})
export class InputCodeComponent implements OnInit {

  @ViewChild('input1', { static: true }) input1: IonInput;

  @ViewChild('input2', { static: true }) input2: IonInput;

  @ViewChild('input3', { static: true }) input3: IonInput;

  @ViewChild('input4', { static: true }) input4: IonInput;

  @ViewChild('input5', { static: true }) input5: IonInput;

  @Input() value: string = '';

  @Input() invalid: boolean;

  @Output() result = new EventEmitter();

  private last: string;

  constructor() { }

  ngOnInit() {

  }

  public change(ev: CustomEvent, inputNumber: number) {
    if (ev.detail.value == '') {
      this.prev(inputNumber);
    }
  }

  public send(ev: CustomEvent, inputNumber: number) {
    // if (String('1234567890').indexOf(ev.detail.value) != -1) {
    //   console.log('entrouuuuuuu')
      this.next(inputNumber);
    // }

    this.last = this.code;

    this.result.emit(this.code);

  }

  private get code() {
    return `${this.input1.value}${this.input2.value}${this.input3.value}${this.input4.value}${this.input5.value}`;
  }

  private prev(inputNumber: number) {
    if (inputNumber == 2) {
      this.input1.setFocus();
    }
    else if (inputNumber == 3) {
      this.input2.setFocus();
    }
    else if (inputNumber == 4) {
      this.input3.setFocus();
    }
    else if (inputNumber == 5) {
      this.input4.setFocus();
    }
  }

  private next(inputNumber: number) {
    if (inputNumber == 1) {
      this.input2.setFocus();
    }
    else if (inputNumber == 2) {
      this.input3.setFocus();
    }
    else if (inputNumber == 3) {
      this.input4.setFocus();
    }
    else if (inputNumber == 4) {
      this.input5.setFocus();
    }
  }

}
