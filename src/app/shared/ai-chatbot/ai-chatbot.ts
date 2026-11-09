import {
  Component,
  signal,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  Inject,
  PLATFORM_ID,
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ChatSource {
  title: string;
  url: string;
  score: number | null;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
}

interface ChatResponse {
  success: boolean;
  answer?: string;
  message?: string;
  sources?: ChatSource[];
  provider?: string;
}

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chatbot.html',
  styleUrl: './ai-chatbot.css',
})
export class AiChatbot implements AfterViewChecked {
  @ViewChild('chatMessages')
  private chatMessages!: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  isLoading = signal(false);
  isFullScreen = signal(false);

  userMessage = '';

  messages = signal<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! Welcome to ESAT. I am your AI assistant. How can I help you today?',
    },
  ]);

  private isBrowser: boolean;

  // Production PHP API
  private readonly API_URL = 'https://api.esat.ae/wp-content/themes/ESAT/api/cloudflare-ai.php';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  toggleChat(): void {
    if (!this.isBrowser) return;

    this.isOpen.update((value) => !value);

    if (!this.isOpen()) {
      this.isFullScreen.set(false);
    }
  }

  toggleFullScreen(): void {
    if (!this.isBrowser || !this.isOpen()) return;

    this.isFullScreen.update((value) => !value);
  }

  sendMessage(): void {
    const message = this.userMessage.trim();

    if (!message || this.isLoading() || !this.isBrowser) {
      return;
    }

    this.messages.update((messages) => [
      ...messages,
      {
        role: 'user',
        content: message,
      },
    ]);

    this.userMessage = '';
    this.isLoading.set(true);

    this.http.post<ChatResponse>(this.API_URL, { message }).subscribe({
      next: (response) => {
        if (!response.success || !response.answer) {
          throw new Error(response.message || 'Invalid AI response');
        }

        this.messages.update((messages) => [
          ...messages,
          {
            role: 'assistant',
            content: response.answer!,
            sources: response.sources || [],
          },
        ]);

        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('ESAT chatbot API error:', error);

        this.messages.update((messages) => [
          ...messages,
          {
            role: 'assistant',
            content:
              'Sorry, I am temporarily unable to respond. Please try again later or contact the ESAT team.',
          },
        ]);

        this.isLoading.set(false);
      },
    });
  }

  handleEnter(event: KeyboardEvent): void {
    if (!event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  ngAfterViewChecked(): void {
    if (!this.isBrowser || !this.isOpen()) {
      return;
    }

    if (this.chatMessages) {
      const element = this.chatMessages.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
}
