import { Component, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-accessibility',
  standalone: true,
  templateUrl: './accessibility.html',
  styleUrl: './accessibility.css',
})
export class AccessibilityComponent implements OnDestroy {
  isOpen = false;
  isReading = false;

  private fontLevel = 0;
  private highContrast = false;
  private grayscale = false;
  private highlightedLinks = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  private get root(): HTMLElement {
    return this.document.documentElement;
  }

  changeFont(amount: number): void {
    this.fontLevel = Math.max(-2, Math.min(4, this.fontLevel + amount));

    const scale = 1 + this.fontLevel * 0.1;

    this.root.style.setProperty('--a11y-page-zoom', String(scale));
    this.root.classList.add('a11y-text-scaled');
  }

  toggleContrast(): void {
    this.highContrast = !this.highContrast;
    this.root.classList.toggle('a11y-high-contrast', this.highContrast);
  }

  toggleGrayscale(): void {
    this.grayscale = !this.grayscale;
    this.root.classList.toggle('a11y-grayscale', this.grayscale);
  }

  toggleLinks(): void {
    this.highlightedLinks = !this.highlightedLinks;
    this.root.classList.toggle('a11y-highlight-links', this.highlightedLinks);
  }

  resetAccessibility(): void {
    this.fontLevel = 0;
    this.highContrast = false;
    this.grayscale = false;
    this.highlightedLinks = false;

    this.root.style.removeProperty('--a11y-page-zoom');

    this.root.classList.remove(
      'a11y-text-scaled',
      'a11y-high-contrast',
      'a11y-grayscale',
      'a11y-highlight-links',
    );
  }

  readPageAloud(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const selectedText = window.getSelection()?.toString().trim();

    // Read selected text if available; otherwise read the entire page.
    const textToRead = selectedText || this.document.body?.innerText.replace(/\s+/g, ' ').trim();

    if (!textToRead) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(textToRead);

    speech.lang = 'en-US';
    speech.rate = 1;
    speech.pitch = 1;

    speech.onstart = () => {
      this.isReading = true;
    };

    speech.onend = () => {
      this.isReading = false;
    };

    speech.onerror = () => {
      this.isReading = false;
    };

    window.speechSynthesis.speak(speech);
  }

  readSelectedText(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const selectedText = window.getSelection()?.toString().trim();

    if (!selectedText) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(selectedText);

    speech.lang = 'en-US';
    speech.rate = 1;
    speech.pitch = 1;

    speech.onstart = () => {
      this.isReading = true;
    };

    speech.onend = () => {
      this.isReading = false;
    };

    speech.onerror = () => {
      this.isReading = false;
    };

    window.speechSynthesis.speak(speech);
  }

  stopReading(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.isReading = false;
  }

  ngOnDestroy(): void {
    this.stopReading();
  }
}
