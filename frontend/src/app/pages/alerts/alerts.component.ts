import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Alert {
  id: string;
  type: 'sale' | 'threshold' | 'campaign' | 'system' | 'price';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  action?: { label: string; url: string };
}

interface AlertRule {
  id: string;
  name: string;
  type: string;
  condition: string;
  enabled: boolean;
  channels: string[];
}

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">Alerts</h1>
          <p class="page-subtitle">Monitor important events and notifications</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="markAllAsRead()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Mark All Read
          </button>
          <button class="btn btn-primary" (click)="showNewRuleModal = true">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Alert Rule
          </button>
        </div>
      </div>

      <!-- Alert Summary -->
      <div class="summary-grid animate-fade-in-up">
        <div class="summary-card">
          <div class="summary-icon unread">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <div class="summary-content">
            <span class="summary-value">{{ unreadCount }}</span>
            <span class="summary-label">Unread Alerts</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon high">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div class="summary-content">
            <span class="summary-value">{{ highPriorityCount }}</span>
            <span class="summary-label">High Priority</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon rules">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <div class="summary-content">
            <span class="summary-value">{{ activeRulesCount }}</span>
            <span class="summary-label">Active Rules</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon total">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="summary-content">
            <span class="summary-value">{{ todayCount }}</span>
            <span class="summary-label">Today's Alerts</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-grid">
        <!-- Alerts List -->
        <div class="alerts-section animate-fade-in-up" style="animation-delay: 0.1s">
          <div class="section-header">
            <h2 class="section-title">Recent Alerts</h2>
            <div class="filter-tabs">
              <button class="filter-tab" [class.active]="alertFilter === 'all'" (click)="alertFilter = 'all'">All</button>
              <button class="filter-tab" [class.active]="alertFilter === 'unread'" (click)="alertFilter = 'unread'">Unread</button>
              <button class="filter-tab" [class.active]="alertFilter === 'high'" (click)="alertFilter = 'high'">High Priority</button>
            </div>
          </div>

          <div class="alerts-list">
            <div *ngFor="let alert of filteredAlerts" 
                 class="alert-item"
                 [class.unread]="!alert.read"
                 [class]="'priority-' + alert.priority">
              <div class="alert-icon" [class]="alert.type">
                <svg *ngIf="alert.type === 'sale'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <svg *ngIf="alert.type === 'threshold'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                <svg *ngIf="alert.type === 'campaign'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <svg *ngIf="alert.type === 'system'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <svg *ngIf="alert.type === 'price'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
              <div class="alert-content">
                <div class="alert-header">
                  <span class="alert-title">{{ alert.title }}</span>
                  <span class="priority-badge" [class]="alert.priority">{{ alert.priority }}</span>
                </div>
                <p class="alert-message">{{ alert.message }}</p>
                <div class="alert-footer">
                  <span class="alert-time">{{ alert.time }}</span>
                  <button *ngIf="alert.action" class="alert-action">{{ alert.action.label }}</button>
                </div>
              </div>
              <div class="alert-actions">
                <button class="action-btn" title="Mark as read" *ngIf="!alert.read" (click)="markAsRead(alert)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
                <button class="action-btn" title="Dismiss" (click)="dismissAlert(alert)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <div *ngIf="filteredAlerts.length === 0" class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <span class="empty-title">No alerts found</span>
              <span class="empty-text">You're all caught up!</span>
            </div>
          </div>
        </div>

        <!-- Alert Rules -->
        <div class="rules-section animate-fade-in-up" style="animation-delay: 0.15s">
          <div class="section-header">
            <h2 class="section-title">Alert Rules</h2>
            <button class="btn btn-secondary btn-sm" (click)="showNewRuleModal = true">+ Add Rule</button>
          </div>

          <div class="rules-list">
            <div *ngFor="let rule of alertRules" class="rule-item">
              <div class="rule-header">
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="rule.enabled">
                  <span class="toggle-slider"></span>
                </label>
                <div class="rule-info">
                  <span class="rule-name">{{ rule.name }}</span>
                  <span class="rule-type">{{ rule.type }}</span>
                </div>
              </div>
              <div class="rule-condition">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                {{ rule.condition }}
              </div>
              <div class="rule-channels">
                <span *ngFor="let channel of rule.channels" class="channel-badge">{{ channel }}</span>
              </div>
              <button class="action-btn" title="Edit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Quick Rule Templates -->
          <div class="templates-section">
            <h3 class="templates-title">Quick Templates</h3>
            <div class="template-buttons">
              <button class="template-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Sale Notification
              </button>
              <button class="template-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                Revenue Threshold
              </button>
              <button class="template-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                Ad Spend Alert
              </button>
              <button class="template-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Review Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1600px;
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

    .header-actions {
      display: flex;
      gap: 0.75rem;
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
      transition: all 0.2s ease;
    }

    .btn-sm {
      padding: 0.5rem 0.875rem;
      font-size: 0.8125rem;
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

    .btn-secondary {
      background: white;
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    /* Summary Grid */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 1024px) {
      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
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
      transition: all 0.3s ease;
    }

    .summary-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    }

    .summary-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }

    .summary-icon svg {
      width: 24px;
      height: 24px;
    }

    .summary-icon.unread {
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
    }

    .summary-icon.high {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }

    .summary-icon.rules {
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
    }

    .summary-icon.total {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .summary-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .summary-label {
      display: block;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 1200px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    .alerts-section,
    .rules-section {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .filter-tabs {
      display: flex;
      background: var(--background-subtle);
      padding: 0.25rem;
      border-radius: 8px;
    }

    .filter-tab {
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-muted);
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-tab:hover {
      color: var(--text-primary);
    }

    .filter-tab.active {
      background: white;
      color: var(--text-primary);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    /* Alerts List */
    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 600px;
      overflow-y: auto;
    }

    .alert-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: var(--background);
      border-radius: 12px;
      border-left: 3px solid transparent;
      transition: all 0.2s;
    }

    .alert-item:hover {
      background: var(--primary-light);
    }

    .alert-item.unread {
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .alert-item.priority-high {
      border-left-color: var(--error);
    }

    .alert-item.priority-medium {
      border-left-color: var(--warning);
    }

    .alert-item.priority-low {
      border-left-color: var(--success);
    }

    .alert-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .alert-icon svg {
      width: 20px;
      height: 20px;
    }

    .alert-icon.sale {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .alert-icon.threshold {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }

    .alert-icon.campaign {
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
    }

    .alert-icon.system {
      background: rgba(59, 130, 246, 0.1);
      color: var(--info);
    }

    .alert-icon.price {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .alert-content {
      flex: 1;
      min-width: 0;
    }

    .alert-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .alert-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .priority-badge {
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
    }

    .priority-badge.high {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }

    .priority-badge.medium {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .priority-badge.low {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .alert-message {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      margin: 0 0 0.5rem 0;
      line-height: 1.5;
    }

    .alert-footer {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .alert-time {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .alert-action {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--accent-blue);
      background: none;
      border: none;
      cursor: pointer;
    }

    .alert-action:hover {
      text-decoration: underline;
    }

    .alert-actions {
      display: flex;
      gap: 0.25rem;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .alert-item:hover .alert-actions {
      opacity: 1;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: white;
      color: var(--primary);
    }

    .action-btn svg {
      width: 16px;
      height: 16px;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      text-align: center;
    }

    .empty-state svg {
      width: 48px;
      height: 48px;
      color: var(--text-light);
      margin-bottom: 1rem;
    }

    .empty-title {
      display: block;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 0.25rem;
    }

    .empty-text {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    /* Rules List */
    .rules-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .rule-item {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--background);
      border-radius: 12px;
      position: relative;
    }

    .rule-item .action-btn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      opacity: 0;
    }

    .rule-item:hover .action-btn {
      opacity: 1;
    }

    .rule-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .toggle-switch {
      position: relative;
      width: 40px;
      height: 22px;
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
      border-radius: 22px;
    }

    .toggle-slider::before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .toggle-switch input:checked + .toggle-slider {
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    }

    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(18px);
    }

    .rule-info {
      flex: 1;
    }

    .rule-name {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .rule-type {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .rule-condition {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);
      padding: 0.5rem 0.75rem;
      background: white;
      border-radius: 8px;
    }

    .rule-condition svg {
      width: 16px;
      height: 16px;
      color: var(--text-muted);
    }

    .rule-channels {
      display: flex;
      gap: 0.25rem;
    }

    .channel-badge {
      font-size: 0.6875rem;
      font-weight: 500;
      padding: 0.125rem 0.5rem;
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
      border-radius: 4px;
    }

    /* Templates Section */
    .templates-section {
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-light);
    }

    .templates-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.875rem 0;
    }

    .template-buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }

    .template-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
      background: var(--background);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .template-btn:hover {
      background: var(--primary-light);
      color: var(--primary);
    }

    .template-btn svg {
      width: 16px;
      height: 16px;
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
export class AlertsComponent {
  alertFilter = 'all';
  showNewRuleModal = false;

  alerts: Alert[] = [
    { id: '1', type: 'sale', title: 'New Sale Recorded', message: 'The Midnight Library sold 3 copies on Amazon.', time: '2 minutes ago', read: false, priority: 'low', action: { label: 'View Details', url: '#' } },
    { id: '2', type: 'threshold', title: 'Revenue Goal Reached!', message: 'You\'ve hit your monthly revenue target of $25,000. Congratulations!', time: '1 hour ago', read: false, priority: 'high' },
    { id: '3', type: 'campaign', title: 'Campaign Performance Alert', message: 'Your January Newsletter exceeded baseline open rates by 15%.', time: '3 hours ago', read: false, priority: 'medium' },
    { id: '4', type: 'price', title: 'Competitor Price Change', message: 'A competing title in Romance has dropped price to $0.99.', time: '5 hours ago', read: true, priority: 'medium', action: { label: 'Analyze', url: '#' } },
    { id: '5', type: 'system', title: 'Weekly Report Ready', message: 'Your weekly royalties summary has been generated and is ready to download.', time: 'Yesterday', read: true, priority: 'low', action: { label: 'Download', url: '#' } },
    { id: '6', type: 'sale', title: 'Kindle Unlimited Page Reads', message: 'You received 1,247 page reads in the last 24 hours.', time: 'Yesterday', read: true, priority: 'low' }
  ];

  alertRules: AlertRule[] = [
    { id: '1', name: 'Daily Sales Notification', type: 'Sales', condition: 'Any new sale', enabled: true, channels: ['Email', 'Push'] },
    { id: '2', name: 'Monthly Revenue Goal', type: 'Threshold', condition: 'Revenue > $25,000', enabled: true, channels: ['Email'] },
    { id: '3', name: 'Campaign Performance', type: 'Campaign', condition: 'Open rate > 40%', enabled: true, channels: ['Push'] },
    { id: '4', name: 'Price Drop Alert', type: 'Competitive', condition: 'Competitor price change', enabled: false, channels: ['Email'] }
  ];

  get unreadCount(): number {
    return this.alerts.filter(a => !a.read).length;
  }

  get highPriorityCount(): number {
    return this.alerts.filter(a => a.priority === 'high').length;
  }

  get activeRulesCount(): number {
    return this.alertRules.filter(r => r.enabled).length;
  }

  get todayCount(): number {
    return this.alerts.filter(a => a.time.includes('ago') || a.time.includes('hour')).length;
  }

  get filteredAlerts(): Alert[] {
    if (this.alertFilter === 'unread') return this.alerts.filter(a => !a.read);
    if (this.alertFilter === 'high') return this.alerts.filter(a => a.priority === 'high');
    return this.alerts;
  }

  markAsRead(alert: Alert): void {
    alert.read = true;
  }

  markAllAsRead(): void {
    this.alerts.forEach(a => a.read = true);
  }

  dismissAlert(alert: Alert): void {
    this.alerts = this.alerts.filter(a => a.id !== alert.id);
  }
}
