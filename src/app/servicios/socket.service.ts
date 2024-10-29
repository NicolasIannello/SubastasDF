import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';

const base_url=environment.base_url2;
const token=environment.socketToken;

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket;

  constructor() {
    this.socket = io(base_url, {
      auth: {
        token: token,
      },
    });
  }

  public sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  public onMessage() {
    return new Observable(observer => {
      this.socket.on('message', (message) => {
        observer.next(message);
      });
    });
  }
}