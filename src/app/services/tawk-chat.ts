import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TawkChatService {
  private loaded = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  load(): void {
    if (!isPlatformBrowser(this.platformId) || this.loaded) {
      return;
    }

    this.loaded = true;

    const script = document.createElement('script');

    script.async = true;
    script.src = 'https://embed.tawk.to/6ae1a520ef82cb3471b59bf3/1k60mq1ur';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    document.head.appendChild(script);
  }
}
