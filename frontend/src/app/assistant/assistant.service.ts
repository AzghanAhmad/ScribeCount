import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ResponseMetadata {
  dateRange?: string;
  metricsAccessed?: string[];
  currency?: string;
  timezone?: string;
  dataLastSynced?: string;
  assumptions?: string[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  shortSummary?: string;
  expandedExplanation?: string;
  timestamp: Date;
  metadata?: {
    duration?: number;
    source?: string;
    confidence?: number;
  };
  responseMetadata?: ResponseMetadata;
}

export interface AssistantState {
  isOpen: boolean;
  messages: ConversationMessage[];
  isListening: boolean;
  isPlayingAudio: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  private initialState: AssistantState = {
    isOpen: false,
    messages: [],
    isListening: false,
    isPlayingAudio: false
  };

  private state$ = new BehaviorSubject<AssistantState>(this.initialState);

  get state(): Observable<AssistantState> {
    return this.state$.asObservable();
  }

  getCurrentState(): AssistantState {
    return this.state$.value;
  }

  togglePanel(): void {
    const current = this.state$.value;
    this.state$.next({
      ...current,
      isOpen: !current.isOpen
    });
  }

  openPanel(): void {
    const current = this.state$.value;
    this.state$.next({
      ...current,
      isOpen: true
    });
  }

  closePanel(): void {
    const current = this.state$.value;
    this.state$.next({
      ...current,
      isOpen: false
    });
  }

  addMessage(message: ConversationMessage): void {
    const current = this.state$.value;
    this.state$.next({
      ...current,
      messages: [...current.messages, message]
    });
  }

  clearMessages(): void {
    const current = this.state$.value;
    this.state$.next({
      ...current,
      messages: []
    });
  }

  setListening(isListening: boolean): void {
    const current = this.state$.value;
    this.state$.next({
      ...current,
      isListening
    });
  }

  setPlayingAudio(isPlayingAudio: boolean): void {
    const current = this.state$.value;
    this.state$.next({
      ...current,
      isPlayingAudio
    });
  }
}
