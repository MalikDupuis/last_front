import { Component, OnInit } from "@angular/core";
import { ChatMessage } from "../../interfaces/chatMessage.interface";
import { ChatService } from "../../services/chat.service";
import { CommonModule } from "@angular/common";
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  newMessage = '';
  messages: ChatMessage[] = [];
  role: 'client' | 'support' | null = null;
  id: string = '';

  // Support : liste de clients et client sélectionné
  clientIds: string[] = [];
  selectedClientId: string | null = null;

  constructor(private chatService: ChatService) {}

  ngOnInit() {}

  chooseRole(selectedRole: 'client' | 'support') {
    this.role = selectedRole;

    if (this.role === 'client') {
      this.id = prompt('Entrez votre identifiant client :') || 'client-' + Math.floor(Math.random() * 10000);
    } else {
      this.id = 'support';
    }

    this.chatService.connect(this.role, this.id);
    this.chatService.message$.subscribe((msg: ChatMessage) => {
      this.messages.push(msg);

      if (this.role === 'support' && msg.sender !== 'support' && !this.clientIds.includes(msg.sender)) {
        this.clientIds.push(msg.sender);
      }
    });
  }

  send() {
    if (!this.newMessage.trim()) return;

    const message: ChatMessage = {
      sender: this.id,
      content: this.newMessage,
      receiver: this.role === 'support' ? this.selectedClientId ?? '' : undefined
    };

    this.chatService.sendMessage(message);
    this.messages.push(message);
    this.newMessage = '';
  }

  getMessagesForSelectedClient(): ChatMessage[] {
    if (this.role === 'support' && this.selectedClientId) {
      return this.messages.filter(
        m => m.sender === this.selectedClientId || (m.sender === 'support' && m.receiver === this.selectedClientId)
      );
    }

    return this.messages;
  }
}