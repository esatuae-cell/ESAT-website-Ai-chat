import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiChatService } from '../../../services/ai-chat.service';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.html',
  styleUrl: './chat-box.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ChatBox {
  private chatService = inject(AiChatService);

  isOpen = false;
  isLoading = false;
  message = '';

  messages: ChatMessage[] = [
    {
      role: 'bot',
      text: 'Hello! Welcome to ESAT. How can I help you today?',
    },
  ];

  suggestions = ['What is ESAT ERP?', 'What modules are available?', 'How can I request a demo?'];

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  askQuestion(question: string): void {
    this.message = question;
    this.sendMessage();
  }

  sendMessage(): void {
    const text = this.message.trim();

    if (!text || this.isLoading) {
      return;
    }

    this.messages.push({ role: 'user', text });
    this.message = '';
    this.isLoading = true;

    this.chatService.sendMessage(text).subscribe({
      next: (response) => {
        this.messages.push({
          role: 'bot',
          text: response.reply,
        });
        this.isLoading = false;
      },
      error: () => {
        this.messages.push({
          role: 'bot',
          text: 'Sorry, I could not connect right now. Please try again.',
        });
        this.isLoading = false;
      },
    });
  }
}
