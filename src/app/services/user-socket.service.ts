import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as socketIOClient from 'socket.io-client';
import * as sailsIOClient from 'sails.io.js';
import { ConfigHelper } from '../helpers/config.helper';

@Injectable({
  providedIn: 'root'
})
export class UserSocketService {

  private io: sailsIOClient.Client;

  constructor() {
    this.io = sailsIOClient(socketIOClient);
    this.io.sails.url = environment.socketUrl;
    this.io.sails.headers = {
      authorization: `Bearer ${localStorage.getItem(ConfigHelper.Storage.AccessToken)}`
    }
  }

  public on(event: string, callback: (data: any) => any) {
    this.io.socket.on(event, callback);
  }

  public subscribe(callback: sailsIOClient.RequestCallback) {
    this.io.socket.post('/user/subscribe', callback);
  }

  public unsubscribe(socket_id: string, callback?: sailsIOClient.RequestCallback) {
    this.io.socket.post('/user/unsubscribe', { socket_id }, callback);
  }

}
