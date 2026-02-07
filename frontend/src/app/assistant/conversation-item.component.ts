import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationMessage } from './assistant.service';
import { VoicePlaybackComponent } from './voice-playback.component';

@Component({
  selector: 'app-conversation-item',
  standalone: true,
  imports: [CommonModule, VoicePlaybackComponent],
  template: `
    <div class="message" [ngClass]="'message-' + message.role">
      <div class="message-content">
        <p class="text">{{ message.content }}</p>
        <ng-container *ngIf="message.role === 'assistant' && (message.shortSummary || message.expandedExplanation)">
          <p *ngIf="message.shortSummary" class="short-summary">{{ message.shortSummary }}</p>
          <details *ngIf="message.expandedExplanation" class="expanded-details">
            <summary>Expand written explanation</summary>
            <p class="expanded-explanation">{{ message.expandedExplanation }}</p>
          </details>
        </ng-container>
        <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
      </div>

      <div *ngIf="message.role === 'assistant'" class="output-actions">
        <button type="button" class="output-btn" title="Email report">Email report</button>
        <button type="button" class="output-btn" title="Save report">Save report</button>
        <button type="button" class="output-btn" title="Export PDF">Export PDF</button>
        <button type="button" class="output-btn" title="Schedule">Schedule</button>
        <button type="button" class="output-btn" title="Compare">Compare</button>
      </div>

      <app-voice-playback
        *ngIf="message.role === 'assistant' && message.metadata?.source === 'ai'"
        [messageId]="message.id"
      ></app-voice-playback>

      <div *ngIf="message.metadata" class="metadata-badges">
        <span *ngIf="message.metadata.confidence" class="badge confidence">
          {{ (message.metadata.confidence * 100).toFixed(0) }}%
        </span>
        <span *ngIf="message.metadata.duration" class="badge duration">{{ message.metadata.duration }}s</span>
        <span *ngIf="message.metadata.source" class="badge source">{{ message.metadata.source }}</span>
      </div>
    </div>
  `,
  styles: [`
    .message {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .message-user { align-items: flex-end; }
    .message-assistant { align-items: flex-start; }

    .message-content {
      max-width: 95%;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      word-wrap: break-word;
    }

    .message-user .message-content {
      background: rgb(28, 46, 74);
      color: white;
      border-bottom-right-radius: 2px;
    }

    .message-assistant .message-content {
      background: var(--background);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      border-bottom-left-radius: 2px;
    }

    .text { margin: 0; font-size: 0.9375rem; line-height: 1.5; }
    .short-summary {
      margin: 0.5rem 0 0 0;
      font-size: 0.875rem;
      font-style: italic;
      color: var(--text-secondary);
    }
    .expanded-details {
      margin-top: 0.5rem;
      font-size: 0.875rem;
    }
    .expanded-details summary {
      cursor: pointer;
      color: var(--primary);
      font-weight: 500;
    }
    .expanded-explanation {
      margin: 0.5rem 0 0 0;
      line-height: 1.5;
      color: var(--text-secondary);
    }

    .timestamp {
      display: block;
      font-size: 0.75rem;
      color: inherit;
      opacity: 0.7;
      margin-top: 0.25rem;
    }
    .message-user .timestamp { color: white; }
    .message-assistant .timestamp { color: var(--text-muted); }

    .output-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-top: 0.5rem;
      padding-left: 1rem;
    }
    .output-btn {
      padding: 0.375rem 0.625rem;
      font-size: 0.75rem;
      font-weight: 500;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s;
    }
    .output-btn:hover {
      background: var(--primary-bg);
      border-color: var(--primary);
      color: var(--primary);
    }

    .metadata-badges {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
      padding-left: 1rem;
      flex-wrap: wrap;
    }
    .badge {
      display: inline-block;
      padding: 0.2rem 0.4rem;
      background: var(--border-color);
      color: var(--text-secondary);
      border-radius: 4px;
      font-size: 0.6875rem;
      font-weight: 500;
    }
    .badge.confidence { background: rgba(46, 125, 50, 0.15); color: var(--trend-up); }
    .badge.duration { background: rgba(33, 150, 243, 0.1); color: #1565c0; }
    .badge.source { background: rgba(156, 39, 176, 0.1); color: #6a1b9a; }
  `]
})
export class ConversationItemComponent {
  @Input() message!: ConversationMessage;

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
}
