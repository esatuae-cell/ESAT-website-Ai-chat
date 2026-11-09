import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatResponse {
  reply: string;
  success: boolean;
  answer: string;
  message?: string;
  sources?: {
    title: string;
    url: string;
    score?: number;
  }[];
  provider?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiChatService {
  private http = inject(HttpClient);

  private apiUrl = 'https://api.esat.ae/wp-content/themes/ESAT/api/cloudflare-ai.php';

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, { message });
  }
}
