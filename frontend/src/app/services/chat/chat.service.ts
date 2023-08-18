import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: Socket;
  private url = 'http://localhost:3000';

  constructor() { 
    this.socket = io(this.url)
  }

  joinRoom(data:any): void{
    this.socket.emit('join', data)
  }

  sendMessage(data:any): void{
    this.socket.emit('message', data);
  }

  getMessage(): Observable<any>{
    return new Observable<{user:string, message:string}>(
      observer =>{
        this.socket.on('new message', (data:any)=>{
          observer.next(data)
        });
        return () =>{
          this.socket.disconnect()
        }
      }
    )
  }
}
