import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Briefing {
  id: string;
  name: string;
  description: string;
  schedule: string;
  nextRun: string;
  lastRun?: string;
  channels: string[];
  enabled: boolean;
  sections: string[];
}

@Component({
  selector: 'app-scheduled-briefings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">Scheduled Briefings</h1>
          <p class="page-subtitle">Automated reports delivered to your inbox</p>
        </div>
        <button class="btn btn-primary" (click)="createBriefing()">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Briefing
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="summary-grid animate-fade-in-up">
        <div class="summary-card">
          <div class="card-icon active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="card-content">
            <span class="card-value">{{ activeBriefings.length }}</span>
            <span class="card-label">Active Briefings</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon sent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
            </svg>
          </div>
          <div class="card-content">
            <span class="card-value">24</span>
            <span class="card-label">Sent This Month</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="card-content">
            <span class="card-value">{{ nextBriefingTime }}</span>
            <span class="card-label">Next Briefing</span>
          </div>
        </div>
      </div>

      <!-- Briefings List -->
      <div class="briefings-section animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="section-header">
          <h2 class="section-title">Your Briefings</h2>
        </div>

        <div class="briefings-list">
          <div *ngFor="let briefing of briefings" class="briefing-card" [class.disabled]="!briefing.enabled">
            <div class="briefing-header">
              <label class="toggle-switch">
                <input type="checkbox" [(ngModel)]="briefing.enabled">
                <span class="toggle-slider"></span>
              </label>
              <div class="briefing-info">
                <h3 class="briefing-name">{{ briefing.name }}</h3>
                <p class="briefing-desc">{{ briefing.description }}</p>
              </div>
              <div class="briefing-actions">
                <button class="action-btn" title="Edit" (click)="editBriefing(briefing)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="action-btn" title="Send Now" (click)="sendNow(briefing)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 2L11 13"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
                  </svg>
                </button>
                <button class="action-btn danger" title="Delete" (click)="deleteBriefing(briefing)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="briefing-details">
              <div class="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>{{ briefing.schedule }}</span>
              </div>
              <div class="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>Next: {{ briefing.nextRun }}</span>
              </div>
              <div *ngIf="briefing.lastRun" class="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Last sent: {{ briefing.lastRun }}</span>
              </div>
            </div>

            <div class="briefing-footer">
              <div class="channels">
                <span *ngFor="let channel of briefing.channels" class="channel-badge">
                  <svg *ngIf="channel === 'Email'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <svg *ngIf="channel === 'Slack'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/>
                    <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                  </svg>
                  <svg *ngIf="channel === 'SMS'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {{ channel }}
                </span>
              </div>
              <div class="sections">
                <span class="sections-count">{{ briefing.sections.length }} sections</span>
                <div class="sections-list">
                  <span *ngFor="let section of briefing.sections.slice(0, 3)" class="section-tag">{{ section }}</span>
                  <span *ngIf="briefing.sections.length > 3" class="section-more">+{{ briefing.sections.length - 3 }} more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Templates Section -->
      <div class="templates-section animate-fade-in-up" style="animation-delay: 0.2s">
        <div class="section-header">
          <h2 class="section-title">Quick Templates</h2>
          <span class="section-subtitle">Start with a pre-built briefing</span>
        </div>
        <div class="templates-grid">
          <button *ngFor="let template of templates" class="template-card" (click)="useTemplate(template)">
            <div class="template-icon" [style.background]="template.gradient">
              <svg [innerHTML]="template.icon"></svg>
            </div>
            <div class="template-content">
              <span class="template-name">{{ template.name }}</span>
              <span class="template-schedule">{{ template.schedule }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1100px;
      animation: fadeIn 0.5s ease-out;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .page-subtitle {
      font-size: 1rem;
      color: var(--text-muted);
      margin: 0;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-icon {
      width: 18px;
      height: 18px;
    }

    .btn-primary {
      background: linear-gradient(135deg, rgb(28, 46, 74) 0%, rgb(45, 75, 120) 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(28, 46, 74, 0.25);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(28, 46, 74, 0.3);
    }

    /* Summary Grid */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .summary-grid {
        grid-template-columns: 1fr;
      }
    }

    .summary-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 14px;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }

    .card-icon svg {
      width: 24px;
      height: 24px;
    }

    .card-icon.active {
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
    }

    .card-icon.sent {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .card-icon.next {
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
    }

    .card-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .card-label {
      display: block;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    /* Section Header */
    .section-header {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .section-subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    /* Briefings Section */
    .briefings-section {
      margin-bottom: 2rem;
    }

    .briefings-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .briefing-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s;
    }

    .briefing-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    .briefing-card.disabled {
      opacity: 0.6;
    }

    .briefing-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .toggle-switch {
      position: relative;
      width: 44px;
      height: 24px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background-color: #e2e8f0;
      transition: 0.3s;
      border-radius: 24px;
    }

    .toggle-slider::before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .toggle-switch input:checked + .toggle-slider {
      background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
    }

    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(20px);
    }

    .briefing-info {
      flex: 1;
    }

    .briefing-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .briefing-desc {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin: 0;
    }

    .briefing-actions {
      display: flex;
      gap: 0.25rem;
    }

    .action-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--background);
      border: none;
      border-radius: 8px;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: var(--border-light);
      color: var(--text-primary);
    }

    .action-btn.danger:hover {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }

    .action-btn svg {
      width: 16px;
      height: 16px;
    }

    .briefing-details {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      padding: 1rem 0;
      border-top: 1px solid var(--border-light);
      border-bottom: 1px solid var(--border-light);
      margin-bottom: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .detail-item svg {
      width: 16px;
      height: 16px;
      color: var(--text-muted);
    }

    .briefing-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .channels {
      display: flex;
      gap: 0.5rem;
    }

    .channel-badge {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.625rem;
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 6px;
    }

    .channel-badge svg {
      width: 14px;
      height: 14px;
    }

    .sections {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sections-count {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .sections-list {
      display: flex;
      gap: 0.25rem;
    }

    .section-tag {
      font-size: 0.6875rem;
      padding: 0.25rem 0.5rem;
      background: var(--background);
      color: var(--text-secondary);
      border-radius: 4px;
    }

    .section-more {
      font-size: 0.6875rem;
      color: var(--text-muted);
    }

    /* Templates Section */
    .templates-section {
      margin-bottom: 2rem;
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
    }

    .template-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 12px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
    }

    .template-card:hover {
      border-color: var(--primary);
      background: var(--primary-light);
    }

    .template-icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      color: white;
      flex-shrink: 0;
    }

    .template-icon svg {
      width: 22px;
      height: 22px;
    }

    .template-name {
      display: block;
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .template-schedule {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .animate-fade-in-up {
      opacity: 0;
      animation: fadeInUp 0.5s ease-out forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ScheduledBriefingsComponent {
  briefings: Briefing[] = [
    {
      id: '1',
      name: 'Weekly Performance Summary',
      description: 'Key metrics and highlights from the past week',
      schedule: 'Every Monday at 9:00 AM',
      nextRun: 'Feb 3, 2025',
      lastRun: 'Jan 27, 2025',
      channels: ['Email'],
      enabled: true,
      sections: ['Revenue Overview', 'Book Rankings', 'Marketing ROI', 'KU Performance']
    },
    {
      id: '2',
      name: 'Monthly Royalties Report',
      description: 'Comprehensive breakdown of all royalty earnings',
      schedule: '1st of every month at 8:00 AM',
      nextRun: 'Feb 1, 2025',
      lastRun: 'Jan 1, 2025',
      channels: ['Email', 'Slack'],
      enabled: true,
      sections: ['Platform Breakdown', 'Title Performance', 'Trends', 'Forecasts', 'Tax Summary']
    },
    {
      id: '3',
      name: 'Daily Sales Alert',
      description: 'Quick overview of yesterday\'s sales activity',
      schedule: 'Daily at 7:00 AM',
      nextRun: 'Tomorrow',
      lastRun: 'Today',
      channels: ['Email'],
      enabled: false,
      sections: ['Sales Count', 'Revenue']
    }
  ];

  templates = [
    { name: 'Daily Snapshot', schedule: 'Daily at 8:00 AM', gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)', icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
    { name: 'Weekly Digest', schedule: 'Every Monday', gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>' },
    { name: 'Monthly Summary', schedule: '1st of month', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>' },
    { name: 'Launch Day', schedule: 'One-time', gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' }
  ];

  get activeBriefings(): Briefing[] {
    return this.briefings.filter(b => b.enabled);
  }

  get nextBriefingTime(): string {
    const active = this.activeBriefings;
    if (active.length === 0) return 'None';
    return active[0].nextRun;
  }

  createBriefing(): void {
    console.log('Creating new briefing...');
  }

  editBriefing(briefing: Briefing): void {
    console.log('Editing briefing:', briefing.id);
  }

  sendNow(briefing: Briefing): void {
    console.log('Sending briefing now:', briefing.name);
    briefing.lastRun = 'Just now';
  }

  deleteBriefing(briefing: Briefing): void {
    this.briefings = this.briefings.filter(b => b.id !== briefing.id);
  }

  useTemplate(template: any): void {
    console.log('Using template:', template.name);
  }
}
