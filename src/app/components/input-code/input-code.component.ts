import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-input-code',
  templateUrl: './input-code.component.html',
  styleUrls: ['./input-code.component.scss'],
})
export class InputCodeComponent implements OnInit {

  public formGroup: FormGroup;

  private last: string;

  @Input() value: string;

  @Input() invalid: boolean;

  @Output() result = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    if (this.value == undefined) {
      this.value = '';
    }

    this.formGroup = this.formBuilder.group({
      d1: [this.value.length == 5 ? this.value[0] : '', Validators.required],
      d2: [this.value.length == 5 ? this.value[1] : '', Validators.required],
      d3: [this.value.length == 5 ? this.value[2] : '', Validators.required],
      d4: [this.value.length == 5 ? this.value[3] : '', Validators.required],
      d5: [this.value.length == 5 ? this.value[4] : '', Validators.required]
    });

  }

  public send(ev: any, inputPrev: IonInput, inputNext: IonInput) {

    const value = this.formGroup.value;

    const code = `${value.d1}${value.d2}${value.d3}${value.d4}${value.d5}`;

    if (inputNext != null && !isNaN(Number(ev.key))) {
      inputNext.setFocus();
    }
    else if (inputPrev != null && ev.key == 'Backspace' && code == this.last) {
      inputPrev.setFocus();
    }

    this.last = code;

    this.result.emit(code);

  }

}
