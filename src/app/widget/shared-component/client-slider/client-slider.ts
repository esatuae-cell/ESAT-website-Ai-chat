import { Component, AfterViewInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';

import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

@Component({
  selector: 'app-client-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-slider.html',
  styleUrls: ['./client-slider.css'],
})
export class ClientSlider implements AfterViewInit, OnDestroy {
  isBrowser = false;

  logos: string[] = [];
  slides: string[][] = [];

  private swiper?: Swiper;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Load client logos in order
    for (let i = 1; i <= 61; i++) {
      this.logos.push(`assets/images/clients/logo${i}.png`);
    }

    // Keep logos in original order
    this.slides = this.chunkArray(this.logos, 12);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    // Wait for Angular to render the Swiper HTML
    setTimeout(() => {
      this.initSwiper();
    }, 50);
  }

  private initSwiper(): void {
    const swiperElement = document.querySelector('.mySwiper');

    if (!swiperElement) {
      return;
    }

    // Destroy previous Swiper instance if it exists
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = undefined;
    }

    this.swiper = new Swiper(swiperElement as HTMLElement, {
      slidesPerView: 1,
      loop: true,

      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = undefined;
    }
  }

  private chunkArray(arr: string[], size: number): string[][] {
    const result: string[][] = [];

    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }

    return result;
  }
}
