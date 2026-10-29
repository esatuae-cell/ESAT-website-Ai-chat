import { Component, signal, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';

import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Footer } from '../app/widget/common/footer/footer';
import { Header } from '../app/widget/common/header/header';
import { routes } from './app.routes';
import AOS from 'aos';
import { isPlatformBrowser } from '@angular/common';
import { ChatBox } from './widget/shared-component/chat-box/chat-box';
import { TawkChatService } from './services/tawk-chat';

export const appRoutes = routes;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, AfterViewInit {
  showAboutMenu = false;

  protected readonly title = signal('ESATWEBSITE');

  constructor(
    private router: Router,
    private tawkChatService: TawkChatService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    // Run AOS only in the browser
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 1000,
        once: true,
        offset: 120,
      });

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          setTimeout(() => {
            AOS.refresh();
          }, 200);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    // Load Tawk.to chat widget only in the browser
    this.tawkChatService.load();
  }
}
