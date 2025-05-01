import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../interfaces/chatMessage.interface'
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private stompClient: any;
  public message$: Subject<ChatMessage> = new Subject();

  connect(role: 'client' | 'support', id: string) {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      const topic = role === 'support' ? '/topic/support' : `/topic/${id}`;
      this.stompClient.subscribe(topic, (msg: any) => {
        this.message$.next(JSON.parse(msg.body));
      });
    });
  }

  sendMessage(message: ChatMessage) {
    this.stompClient.send('/app/chat.send', {}, JSON.stringify(message));
  }
}
