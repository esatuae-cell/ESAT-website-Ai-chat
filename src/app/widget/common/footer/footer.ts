import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, RouterLinkActive } from '@angular/router';
import { Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  chatOpen = false;
  message = '';

  messages: {
    sender: 'user' | 'bot';
    text: string;
  }[] = [];
  showBackToTop = false;

  constructor(
    private router: Router,

    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  istore() {
    window.open('https://apps.apple.com/ae/app/esat-erp/id6501984179', '_blank');
  }
  playstore() {
    window.open(
      'https://play.google.com/store/search?q=ESAT+ERp&c=apps&hl=en_IN&gl=US&pli=1',
      '_blank',
    );
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.showBackToTop = window.scrollY > 300;
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  // Ai chart service integration

  sendMessage() {
    if (!this.message.trim()) {
      return;
    }

    const userMessage = this.message.trim();

    console.log('1. User message:', userMessage);

    this.messages.push({
      sender: 'user',
      text: userMessage,
    });

    this.message = '';
  }

  // Ai chart service integration end
}
