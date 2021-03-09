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

  constructor() { }

  ngOnInit() {

  }

  public get code() {
    return `${this.input1.value}${this.input2.value}${this.input3.value}${this.input4.value}${this.input5.value}`;
  }

  public backspace(ev: KeyboardEvent, inputNumber: number) {
    if (ev.key == 'Backspace' || ev.code == 'Backspace' || ev.keyCode == 8 || ev.which == 8) {
      ev.preventDefault();
      if (inputNumber == 5) {
        if (this.input5.value == '') {
          this.input4.value = '';
          this.input4.setFocus();
        }
        else {
          this.input5.value = '';
        }
      }
      else if (inputNumber == 4) {
        if (this.input4.value == '') {
          this.input3.value = '';
          this.input3.setFocus();
        }
        else {
          this.input4.value = '';
        }
      }
      else if (inputNumber == 3) {
        if (this.input3.value == '') {
          this.input2.value = '';
          this.input2.setFocus();
        }
        else {
          this.input3.value = '';
        }
      }
      else if (inputNumber == 2) {
        if (this.input2.value == '') {
          this.input1.value = '';
          this.input1.setFocus();
        }
        else {
          this.input2.value = '';
        }
      }
      else if (inputNumber == 1) {
        this.input1.value = '';
      }
    }
  }

  public next(inputNumber: number) {
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

  public emit() {
    this.result.emit(this.code);
    console.log(this.code)
  }
}
