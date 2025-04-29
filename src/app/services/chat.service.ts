import { Injectable } from '@angular/core';
import { Client, Message, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatMessage {
  sender: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient!: Client;
  private messagesSubject = new BehaviorSubject<ChatMessage | null>(null);
  public messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.connect(); // Très important !
  }
  

  connect(): void {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = over(socket);

    this.stompClient.connect({}, () => {
      console.log('WebSocket connected');
      this.stompClient.subscribe('/topic/messages', (message: Message) => {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        this.messagesSubject.next(chatMessage);
      });
    }, (error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  
  

  sendMessage(message: ChatMessage) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send('/app/chat.send', {}, JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }
}
