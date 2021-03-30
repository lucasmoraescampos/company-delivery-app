import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as socketIOClient from 'socket.io-client';
import * as sailsIOClient from 'sails.io.js';

@Injectable({
  providedIn: 'root'
})
export class UserSocketService {

  private io: sailsIOClient.Client;

  constructor() {
    this.io = sailsIOClient(socketIOClient);
    this.io.sails.url = environment.socketUrl;
  }

  public on(event: string, callback: (data: any) => any) {
    this.io.socket.on(event, callback);
  }

  public subscribe(user_id: number, callback: sailsIOClient.RequestCallback) {
    this.io.socket.post('/user/subscribe', { user_id }, callback);
  }

  public unsubscribe(user_id: number, socket_id: string, callback?: sailsIOClient.RequestCallback) {
    this.io.socket.post('/user/unsubscribe', { user_id, socket_id }, callback);
  }

}
