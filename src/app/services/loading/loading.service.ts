import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject: BehaviorSubject<any>;

  public status: Observable<any>;

  private stack: Array<boolean> = [];

  constructor() {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.status = this.loadingSubject.asObservable();
  }

  public async show() {
    await this.stack.unshift(true);
    this.loadingSubject.next(true);
  }

  public async hide() {
    if (this.stack.length > 0) {
      await this.stack.shift();
      this.loadingSubject.next(this.stack[0]);
    }
    else {
      this.loadingSubject.next(false);
    }
  }
}
