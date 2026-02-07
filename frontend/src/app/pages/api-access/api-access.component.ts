import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  created: string;
  lastUsed?: string;
  status: 'active' | 'expired' | 'revoked';
}

@Component({
  selector: 'app-api-access',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">API Access</h1>
          <p class="page-subtitle">Manage your API keys and integrations</p>
        </div>
        <button class="btn btn-primary" (click)="createApiKey()">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create API Key
        </button>
      </div>

      <!-- API Stats -->
      <div class="stats-grid animate-fade-in-up">
        <div class="stat-card">
          <div class="stat-icon keys">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ activeKeys.length }}</span>
            <span class="stat-label">Active Keys</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon requests">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">12,847</span>
            <span class="stat-label">API Requests Today</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon limit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">100K</span>
            <span class="stat-label">Daily Limit</span>
          </div>
        </div>
      </div>

      <!-- Usage Chart -->
      <div class="usage-card animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="card-header">
          <h2 class="card-title">API Usage</h2>
          <div class="period-select">
            <button class="period-btn" [class.active]="usagePeriod === '7d'" (click)="usagePeriod = '7d'">7 Days</button>
            <button class="period-btn" [class.active]="usagePeriod === '30d'" (click)="usagePeriod = '30d'">30 Days</button>
          </div>
        </div>
        <div class="usage-chart">
          <div class="chart-bars">
            <div *ngFor="let day of usageData" class="bar-container">
              <div class="bar" [style.height.%]="day.percent"></div>
              <span class="bar-label">{{ day.label }}</span>
            </div>
          </div>
          <div class="chart-legend">
            <span class="legend-item success">
              <span class="dot"></span>
              Successful
            </span>
            <span class="legend-item error">
              <span class="dot"></span>
              Errors
            </span>
          </div>
        </div>
      </div>

      <!-- API Keys -->
      <div class="keys-section animate-fade-in-up" style="animation-delay: 0.15s">
        <div class="section-header">
          <h2 class="section-title">API Keys</h2>
        </div>
        <div class="keys-list">
          <div *ngFor="let apiKey of apiKeys" class="key-card" [class.inactive]="apiKey.status !== 'active'">
            <div class="key-header">
              <div class="key-info">
                <h3 class="key-name">{{ apiKey.name }}</h3>
                <div class="key-value">
                  <code class="key-code">{{ maskKey(apiKey.key) }}</code>
                  <button class="copy-btn" (click)="copyKey(apiKey.key)" title="Copy">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  </button>
                </div>
              </div>
              <span class="status-badge" [class]="apiKey.status">{{ apiKey.status }}</span>
            </div>
            <div class="key-details">
              <div class="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Created: {{ apiKey.created }}
              </div>
              <div class="detail-item" *ngIf="apiKey.lastUsed">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Last used: {{ apiKey.lastUsed }}
              </div>
            </div>
            <div class="key-permissions">
              <span class="permissions-label">Permissions:</span>
              <div class="permissions-list">
                <span *ngFor="let perm of apiKey.permissions" class="permission-badge">{{ perm }}</span>
              </div>
            </div>
            <div class="key-actions">
              <button class="action-btn" (click)="editKey(apiKey)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
              <button class="action-btn" (click)="regenerateKey(apiKey)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Regenerate
              </button>
              <button class="action-btn danger" (click)="revokeKey(apiKey)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                Revoke
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Documentation Link -->
      <div class="docs-card animate-fade-in-up" style="animation-delay: 0.2s">
        <div class="docs-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <div class="docs-content">
          <h3 class="docs-title">API Documentation</h3>
          <p class="docs-text">Learn how to integrate with the ScribeCount API. View endpoints, authentication, and examples.</p>
        </div>
        <button class="btn btn-secondary">View Docs</button>
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

    .btn-secondary {
      background: white;
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 14px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }

    .stat-icon svg {
      width: 24px;
      height: 24px;
    }

    .stat-icon.keys {
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
    }

    .stat-icon.requests {
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
    }

    .stat-icon.limit {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .stat-label {
      display: block;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    /* Usage Card */
    .usage-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .period-select {
      display: flex;
      background: var(--background-subtle);
      padding: 0.25rem;
      border-radius: 8px;
    }

    .period-btn {
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

    .period-btn.active {
      background: white;
      color: var(--text-primary);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .usage-chart {
      height: 150px;
    }

    .chart-bars {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 120px;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border-light);
    }

    .bar-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .bar {
      width: 60%;
      max-width: 40px;
      background: linear-gradient(180deg, #3b82f6 0%, #6366f1 100%);
      border-radius: 4px 4px 0 0;
      transition: height 0.3s;
    }

    .bar-label {
      font-size: 0.6875rem;
      color: var(--text-muted);
      position: absolute;
      bottom: 0.5rem;
    }

    .chart-legend {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      padding-top: 0.75rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .legend-item .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .legend-item.success .dot {
      background: #3b82f6;
    }

    .legend-item.error .dot {
      background: var(--error);
    }

    /* Keys Section */
    .section-header {
      margin-bottom: 1rem;
    }

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .keys-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .key-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 14px;
      padding: 1.25rem;
    }

    .key-card.inactive {
      opacity: 0.6;
    }

    .key-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .key-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
    }

    .key-value {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .key-code {
      padding: 0.375rem 0.75rem;
      background: var(--background);
      border-radius: 6px;
      font-family: monospace;
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .copy-btn {
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

    .copy-btn:hover {
      background: var(--background);
      color: var(--text-primary);
    }

    .copy-btn svg {
      width: 16px;
      height: 16px;
    }

    .status-badge {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.25rem 0.625rem;
      border-radius: 100px;
      text-transform: capitalize;
    }

    .status-badge.active {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .status-badge.expired {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .status-badge.revoked {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }

    .key-details {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .detail-item svg {
      width: 14px;
      height: 14px;
    }

    .key-permissions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 0;
      border-top: 1px solid var(--border-light);
      margin-bottom: 1rem;
    }

    .permissions-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-muted);
    }

    .permissions-list {
      display: flex;
      gap: 0.375rem;
      flex-wrap: wrap;
    }

    .permission-badge {
      font-size: 0.6875rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
      border-radius: 4px;
    }

    .key-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
      font-weight: 500;
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
      width: 14px;
      height: 14px;
    }

    /* Docs Card */
    .docs-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
      border: 1px dashed rgba(59, 130, 246, 0.3);
      border-radius: 14px;
    }

    .docs-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 14px;
      color: var(--accent-blue);
    }

    .docs-icon svg {
      width: 28px;
      height: 28px;
    }

    .docs-content {
      flex: 1;
    }

    .docs-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .docs-text {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0;
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
export class ApiAccessComponent {
  usagePeriod = '7d';

  apiKeys: ApiKey[] = [
    {
      id: '1',
      name: 'Production API Key',
      key: 'sc_prod_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456',
      permissions: ['read:royalties', 'read:reports', 'read:analytics'],
      created: 'Jan 15, 2025',
      lastUsed: '2 hours ago',
      status: 'active'
    },
    {
      id: '2',
      name: 'Development Key',
      key: 'sc_dev_zYxWvUtSrQpOnMlKjIhGfEdCbA654321',
      permissions: ['read:royalties', 'write:reports'],
      created: 'Jan 10, 2025',
      lastUsed: 'Yesterday',
      status: 'active'
    },
    {
      id: '3',
      name: 'Legacy Integration',
      key: 'sc_prod_OldKeyThatShouldBeRemoved12345678',
      permissions: ['read:royalties'],
      created: 'Nov 1, 2024',
      lastUsed: '30 days ago',
      status: 'expired'
    }
  ];

  usageData = [
    { label: 'Mon', percent: 65 },
    { label: 'Tue', percent: 78 },
    { label: 'Wed', percent: 82 },
    { label: 'Thu', percent: 56 },
    { label: 'Fri', percent: 91 },
    { label: 'Sat', percent: 42 },
    { label: 'Sun', percent: 38 }
  ];

  get activeKeys(): ApiKey[] {
    return this.apiKeys.filter(k => k.status === 'active');
  }

  maskKey(key: string): string {
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 4);
  }

  createApiKey(): void {
    console.log('Creating new API key...');
  }

  copyKey(key: string): void {
    navigator.clipboard.writeText(key);
    console.log('Key copied to clipboard');
  }

  editKey(key: ApiKey): void {
    console.log('Editing key:', key.id);
  }

  regenerateKey(key: ApiKey): void {
    console.log('Regenerating key:', key.id);
  }

  revokeKey(key: ApiKey): void {
    if (confirm(`Are you sure you want to revoke "${key.name}"?`)) {
      key.status = 'revoked';
    }
  }
}
