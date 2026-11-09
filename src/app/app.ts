import { Component, signal, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs';

import { Footer } from '../app/widget/common/footer/footer';
import { Header } from '../app/widget/common/header/header';
import { routes } from './app.routes';

import AOS from 'aos';

import { ChatBox } from './widget/shared-component/chat-box/chat-box';
import { TawkChatService } from './services/tawk-chat';
import { AccessibilityComponent } from './shared/accessibility/accessibility';
import { AiChatbot } from './shared/ai-chatbot/ai-chatbot';

export const appRoutes = routes;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, AccessibilityComponent, AiChatbot],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, AfterViewInit {
  showAboutMenu = false;

  protected readonly title = signal('ESATWEBSITE');

  constructor(
    private router: Router,

    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    // Browser-only animations
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 1000,
        once: true,
        offset: 120,
      });

      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        AOS.refresh();
      });
    }
  }

  ngAfterViewInit(): void {
    // Load Tawk.to only in the browser
    if (isPlatformBrowser(this.platformId)) {
    }
  }
}
