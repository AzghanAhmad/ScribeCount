import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AssistantService, ConversationMessage, AssistantState, ResponseMetadata } from './assistant.service';
import { ConversationItemComponent } from './conversation-item.component';
import { MetadataPanelComponent } from './metadata-panel.component';

@Component({
  selector: 'app-assistant-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ConversationItemComponent,
    MetadataPanelComponent
  ],
  template: `
    <div class="overlay" *ngIf="state.isOpen" (click)="closePanel()"></div>

    <div class="panel" [class.open]="state.isOpen">
      <div class="panel-header">
        <h2 class="panel-title">Hey ScribeCount</h2>
        <button class="close-btn" (click)="closePanel()">✕</button>
      </div>

      <div class="panel-content">
        <div class="conversation-view">
          <div class="messages-container" #messagesContainer>
            <div *ngIf="state.messages.length === 0" class="empty-state">
              <div class="suggested-questions">
                <h4 class="suggested-title">Suggested questions</h4>
                <p class="suggested-subtitle">You asked this last month — here's an update</p>
                <button type="button" class="suggested-btn" (click)="askSuggested('Royalties last month')">Royalties last month</button>
                <p class="suggested-subtitle">Common questions</p>
                <button type="button" class="suggested-btn" (click)="askSuggested('Compare KU vs Wide')">Compare KU vs Wide</button>
                <button type="button" class="suggested-btn" (click)="askSuggested('Trend by format')">Trend by format</button>
                <p class="suggested-subtitle">Recommended follow-ups</p>
                <button type="button" class="suggested-btn" (click)="askSuggested('Period-over-period comparison')">Period-over-period comparison</button>
              </div>
            </div>

            <div *ngFor="let message of state.messages">
              <app-conversation-item [message]="message"></app-conversation-item>
            </div>

            <div *ngIf="state.isListening" class="listening-indicator">
              <div class="listening-dot"></div>
              <span>Listening...</span>
            </div>
          </div>

          <div class="input-area">
            <div class="input-wrapper">
              <input
                type="text"
                class="message-input"
                placeholder="Ask about your royalties, trends, comparisons, or reports…"
                [(ngModel)]="inputValue"
                (keyup.enter)="sendMessage()"
                [disabled]="state.isListening"
              />
              <button
                class="mic-btn"
                [class.listening]="state.isListening"
                (click)="toggleListening()"
                title="Toggle voice input"
              >
                {{ state.isListening ? '🎙️' : '🎤' }}
              </button>
              <button
                class="send-btn"
                (click)="sendMessage()"
                [disabled]="!inputValue.trim() || state.isListening"
              >
                ↗
              </button>
            </div>

            <div class="action-buttons">
              <button class="action-btn" (click)="clearConversation()">
                <span class="action-icon">🗑️</span>
                <span>Clear</span>
              </button>
              <button class="action-btn" (click)="exportConversation()">
                <span class="action-icon">📥</span>
                <span>Export</span>
              </button>
              <button class="action-btn" (click)="copyLastMessage()">
                <span class="action-icon">📋</span>
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>

        <app-metadata-panel
          [messages]="state.messages"
        ></app-metadata-panel>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1500;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .panel {
      position: fixed;
      top: 64px;
      right: -500px;
      bottom: 0;
      width: 500px;
      background: white;
      box-shadow: -2px 0 12px rgba(0, 0, 0, 0.15);
      z-index: 1501;
      display: flex;
      flex-direction: column;
      transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .panel.open {
      right: 0;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      background: white;
      flex-shrink: 0;
    }

    .panel-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a202c;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #718096;
      cursor: pointer;
      padding: 0;
      transition: color 0.2s;
    }

    .close-btn:hover {
      color: #1a202c;
    }

    .panel-content {
      display: flex;
      flex: 1;
      min-height: 0;
    }

    .conversation-view {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      border-right: 1px solid #e2e8f0;
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .messages-container::-webkit-scrollbar {
      width: 6px;
    }

    .messages-container::-webkit-scrollbar-track {
      background: transparent;
    }

    .messages-container::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 3px;
    }

    .messages-container::-webkit-scrollbar-thumb:hover {
      background: #a0aec0;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      padding: 1rem 0;
      color: var(--text-muted);
    }

    .suggested-questions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .suggested-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .suggested-subtitle {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      margin: 0.5rem 0 0.25rem 0;
    }

    .suggested-btn {
      display: block;
      width: 100%;
      padding: 0.625rem 1rem;
      text-align: left;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.875rem;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .suggested-btn:hover {
      background: var(--primary-bg);
      border-color: var(--primary);
      color: var(--primary);
    }

    .listening-indicator {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: rgba(28, 46, 74, 0.05);
      border-radius: 8px;
      color: rgb(28, 46, 74);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .listening-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgb(28, 46, 74);
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.3;
      }
    }

    .input-area {
      padding: 1.5rem;
      border-top: 1px solid #e2e8f0;
      background: #f5f7fa;
      flex-shrink: 0;
    }

    .input-wrapper {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .message-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid #cbd5e0;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-family: inherit;
      transition: all 0.2s;
    }

    .message-input:focus {
      outline: none;
      border-color: rgb(28, 46, 74);
      box-shadow: 0 0 0 3px rgba(28, 46, 74, 0.1);
    }

    .message-input:disabled {
      background: #e2e8f0;
      color: #a0aec0;
      cursor: not-allowed;
    }

    .mic-btn,
    .send-btn {
      padding: 0.75rem 1rem;
      border: 1px solid #cbd5e0;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mic-btn:hover,
    .send-btn:hover {
      border-color: rgb(28, 46, 74);
      background: rgba(28, 46, 74, 0.05);
    }

    .mic-btn.listening {
      background: rgba(28, 46, 74, 0.1);
      border-color: rgb(28, 46, 74);
      animation: pulse-btn 1.5s infinite;
    }

    @keyframes pulse-btn {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(28, 46, 74, 0.4);
      }
      50% {
        box-shadow: 0 0 0 4px rgba(28, 46, 74, 0);
      }
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: white;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: rgba(28, 46, 74, 0.05);
      border-color: rgb(28, 46, 74);
      color: rgb(28, 46, 74);
    }

    .action-icon {
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .panel {
        width: 100%;
        right: -100%;
      }
    }
  `]
})
export class AssistantPanelComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  state: AssistantState = {
    isOpen: false,
    messages: [],
    isListening: false,
    isPlayingAudio: false
  };

  inputValue = '';
  private destroy$ = new Subject<void>();

  constructor(private assistantService: AssistantService) {}

  ngOnInit(): void {
    this.assistantService.state
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.state = state;
        this.scrollToBottom();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closePanel(): void {
    this.assistantService.closePanel();
  }

  sendMessage(): void {
    if (!this.inputValue.trim()) return;
    const question = this.inputValue.trim();

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
      metadata: { source: 'text', confidence: 0.95 }
    };

    this.assistantService.addMessage(userMessage);
    this.inputValue = '';

    setTimeout(() => {
      const assistantMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Summary: Your royalties for the selected period show an 8% increase period-over-period.',
        shortSummary: 'Royalties up 8% for the period.',
        expandedExplanation: 'Based on the metrics accessed (Royalties, Date range), the analysis indicates an 8% increase compared to the previous period. KDP Select contributed 62% of total; wide distribution 38%. Data reflects last sync.',
        timestamp: new Date(),
        metadata: { source: 'ai', confidence: 0.88 },
        responseMetadata: {
          dateRange: 'Jan 1 – Jan 31, 2025',
          metricsAccessed: ['Royalties', 'Date range', 'Platform'],
          currency: 'USD',
          timezone: 'UTC',
          dataLastSynced: 'Feb 3, 2025 10:00 AM',
          assumptions: ['KDP and wide data included', 'Excludes refunds']
        }
      };
      this.assistantService.addMessage(assistantMessage);
    }, 500);
  }

  askSuggested(question: string): void {
    this.inputValue = question;
    this.sendMessage();
  }

  toggleListening(): void {
    const newState = !this.state.isListening;
    this.assistantService.setListening(newState);

    if (newState) {
      setTimeout(() => {
        const voiceMessage: ConversationMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: 'Voice input captured',
          timestamp: new Date(),
          metadata: {
            source: 'voice',
            duration: 2.5,
            confidence: 0.92
          }
        };

        this.assistantService.addMessage(voiceMessage);
        this.assistantService.setListening(false);
      }, 2000);
    }
  }

  clearConversation(): void {
    if (confirm('Clear all messages? This cannot be undone.')) {
      this.assistantService.clearMessages();
    }
  }

  exportConversation(): void {
    const content = this.state.messages
      .map(m => `[${m.role.toUpperCase()}] ${m.content}`)
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  copyLastMessage(): void {
    if (this.state.messages.length === 0) return;

    const lastMessage = this.state.messages[this.state.messages.length - 1];
    navigator.clipboard.writeText(lastMessage.content).then(() => {
      alert('Message copied to clipboard');
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    });
  }
}
