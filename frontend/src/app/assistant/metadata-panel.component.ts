import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationMessage, ResponseMetadata } from './assistant.service';

@Component({
  selector: 'app-metadata-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metadata-panel">
      <h3 class="panel-title">Metadata</h3>

      <ng-container *ngIf="lastResponseMetadata as meta">
        <div class="section-title">Response context</div>
        <div class="stat-row">
          <span class="stat-label">Date range</span>
          <span class="stat-value">{{ meta.dateRange || '—' }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Metrics accessed</span>
          <span class="stat-value">{{ join(meta.metricsAccessed) }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Currency</span>
          <span class="stat-value">{{ meta.currency || '—' }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Timezone</span>
          <span class="stat-value">{{ meta.timezone || '—' }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Data last synced</span>
          <span class="stat-value">{{ meta.dataLastSynced || '—' }}</span>
        </div>
        <div class="stat-row" *ngIf="meta.assumptions?.length">
          <span class="stat-label">Assumptions</span>
          <span class="stat-value assumptions">{{ join(meta.assumptions) }}</span>
        </div>
        <div class="divider"></div>
      </ng-container>

      <div class="section-title">Session</div>
      <div class="stat-row">
        <span class="stat-label">Messages</span>
        <span class="stat-value">{{ messageCount }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Session duration</span>
        <span class="stat-value">{{ sessionDuration }}</span>
      </div>
      <div *ngIf="lastMessage" class="stat-row">
        <span class="stat-label">Last activity</span>
        <span class="stat-value">{{ formatTime(lastMessage.timestamp) }}</span>
      </div>

      <div class="divider"></div>
      <div class="section-title">Confidence</div>
      <div class="metric-item">
        <div class="metric-bar">
          <div class="metric-fill" [style.width.%]="overallConfidence"></div>
        </div>
        <span class="metric-value">{{ overallConfidence.toFixed(0) }}%</span>
      </div>
    </div>
  `,
  styles: [`
    .metadata-panel {
      padding: 1.25rem;
      background: var(--background);
      border-left: 1px solid var(--border-color);
      width: 220px;
      min-width: 220px;
      height: 100%;
      overflow-y: auto;
      font-size: 0.8125rem;
    }

    .panel-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 1rem 0;
    }

    .section-title {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .stat-row {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border-color);
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .stat-value {
      font-size: 0.8125rem;
      color: var(--text-primary);
      font-weight: 500;
    }

    .stat-value.assumptions {
      font-size: 0.75rem;
      word-break: break-word;
    }

    .divider {
      height: 1px;
      background: var(--border-color);
      margin: 0.75rem 0;
    }

    .metric-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .metric-bar {
      flex: 1;
      height: 4px;
      background: var(--border-color);
      border-radius: 2px;
      overflow: hidden;
    }

    .metric-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .metric-value {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-primary);
      min-width: 28px;
    }
  `]
})
export class MetadataPanelComponent {
  @Input() messages: ConversationMessage[] = [];

  get lastResponseMetadata(): ResponseMetadata | null {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].role === 'assistant' && this.messages[i].responseMetadata) {
        return this.messages[i].responseMetadata!;
      }
    }
    return null;
  }

  get messageCount(): number {
    return this.messages.length;
  }

  get lastMessage(): ConversationMessage | undefined {
    return this.messages[this.messages.length - 1];
  }

  get overallConfidence(): number {
    if (this.messages.length === 0) return 0;
    const confidences = this.messages
      .filter(m => m.metadata?.confidence)
      .map(m => m.metadata!.confidence!);
    if (confidences.length === 0) return 85;
    return (confidences.reduce((a, b) => a + b, 0) / confidences.length) * 100;
  }

  get sessionDuration(): string {
    if (this.messages.length === 0) return '0s';
    const first = this.messages[0].timestamp;
    const last = this.messages[this.messages.length - 1].timestamp;
    const diffMs = new Date(last).getTime() - new Date(first).getTime();
    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  join(arr: string[] | undefined): string {
    return (arr || []).join(', ') || '—';
  }
}
