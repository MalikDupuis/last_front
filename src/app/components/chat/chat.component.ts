import { Component, OnInit } from '@angular/core';
import { ChatMessage, ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  newMessage: string = 'rfrge';
  messages: ChatMessage[] = [];

  constructor(private chatService: ChatService) {}


  send() {
    console.warn("test");
    alert(this.newMessage);
  
    if (this.newMessage.trim() !== '') {
      const message: ChatMessage = {
        sender: 'Client',
        content: this.newMessage
      };
      this.chatService.sendMessage(message);
      this.messages.push(message);  
      this.newMessage = '';  
    }
  }
}
