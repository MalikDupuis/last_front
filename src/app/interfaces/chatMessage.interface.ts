export interface ChatMessage {
    sender: string;
    content: string;
    receiver?: string;
    timestamp?: string;
  }