import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'retail' | 'email' | 'ads' | 'analytics' | 'other';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync?: string;
  credentials?: boolean;
}

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">Integrations</h1>
          <p class="page-subtitle">Connect your data sources and services</p>
        </div>
        <div class="header-search">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" class="search-input" placeholder="Search integrations..." [(ngModel)]="searchQuery">
        </div>
      </div>

      <!-- Integration Stats -->
      <div class="stats-bar animate-fade-in-up">
        <div class="stat-item">
          <span class="stat-value">{{ connectedCount }}</span>
          <span class="stat-label">Connected</span>
          <span class="stat-indicator connected"></span>
        </div>
        <div class="stat-separator"></div>
        <div class="stat-item">
          <span class="stat-value">{{ availableIntegrations.length }}</span>
          <span class="stat-label">Available</span>
        </div>
        <div class="stat-separator"></div>
        <div class="stat-item">
          <span class="stat-value">{{ lastSyncTime }}</span>
          <span class="stat-label">Last Sync</span>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="category-tabs animate-fade-in-up" style="animation-delay: 0.1s">
        <button *ngFor="let cat of categories" 
                class="category-tab"
                [class.active]="activeCategory === cat.id"
                (click)="activeCategory = cat.id">
          <span class="tab-icon" [innerHTML]="cat.icon"></span>
          {{ cat.label }}
          <span class="tab-count">{{ getCategoryCount(cat.id) }}</span>
        </button>
      </div>

      <!-- Connected Integrations -->
      <div *ngIf="connectedIntegrations.length > 0" class="section animate-fade-in-up" style="animation-delay: 0.15s">
        <h2 class="section-title">Connected</h2>
        <div class="integrations-grid">
          <div *ngFor="let integration of connectedIntegrations" class="integration-card connected">
            <div class="card-header">
              <div class="integration-icon" [innerHTML]="integration.icon"></div>
              <div class="status-badge connected">
                <span class="status-dot"></span>
                Connected
              </div>
            </div>
            <h3 class="integration-name">{{ integration.name }}</h3>
            <p class="integration-desc">{{ integration.description }}</p>
            <div class="integration-meta">
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Last sync: {{ integration.lastSync || 'Never' }}
              </span>
            </div>
            <div class="card-actions">
              <button class="btn btn-secondary btn-sm">Configure</button>
              <button class="btn btn-ghost btn-sm">Sync Now</button>
              <button class="btn btn-ghost btn-sm danger">Disconnect</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Available Integrations -->
      <div class="section animate-fade-in-up" style="animation-delay: 0.2s">
        <h2 class="section-title">Available Integrations</h2>
        <div class="integrations-grid">
          <div *ngFor="let integration of filteredAvailable" class="integration-card">
            <div class="card-header">
              <div class="integration-icon" [innerHTML]="integration.icon"></div>
              <span class="category-badge" [class]="integration.category">{{ integration.category }}</span>
            </div>
            <h3 class="integration-name">{{ integration.name }}</h3>
            <p class="integration-desc">{{ integration.description }}</p>
            <div class="card-actions">
              <button class="btn btn-primary btn-sm" (click)="connectIntegration(integration)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Connect
              </button>
              <button class="btn btn-ghost btn-sm">Learn More</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Request Integration -->
      <div class="request-section animate-fade-in-up" style="animation-delay: 0.25s">
        <div class="request-card">
          <div class="request-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div class="request-content">
            <h3 class="request-title">Need another integration?</h3>
            <p class="request-desc">We're constantly adding new integrations. Let us know what you'd like to see.</p>
          </div>
          <button class="btn btn-secondary">Request Integration</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1400px;
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

    .header-search {
      position: relative;
      width: 280px;
    }

    .search-icon {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: var(--text-muted);
    }

    .search-input {
      width: 100%;
      padding: 0.625rem 0.875rem 0.625rem 2.5rem;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      font-size: 0.875rem;
      background: white;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Stats Bar */
    .stats-bar {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 1.25rem 2rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 14px;
      margin-bottom: 1.5rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .stat-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .stat-indicator.connected {
      background: var(--success);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .stat-separator {
      width: 1px;
      height: 30px;
      background: var(--border-light);
    }

    /* Category Tabs */
    .category-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .category-tab {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .category-tab:hover {
      border-color: var(--primary);
    }

    .category-tab.active {
      background: var(--primary-light);
      border-color: var(--primary);
      color: var(--primary);
    }

    .tab-icon {
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
    }

    .tab-icon svg,
    .tab-icon :global(svg) {
      width: 100%;
      height: 100%;
    }

    .tab-count {
      font-size: 0.75rem;
      padding: 0.125rem 0.375rem;
      background: var(--background-subtle);
      border-radius: 4px;
    }

    .category-tab.active .tab-count {
      background: rgba(28, 46, 74, 0.1);
    }

    /* Section */
    .section {
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 1rem 0;
    }

    /* Integrations Grid */
    .integrations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .integration-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 14px;
      padding: 1.25rem;
      transition: all 0.3s ease;
    }

    .integration-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    }

    .integration-card.connected {
      border-color: rgba(16, 185, 129, 0.3);
      background: rgba(16, 185, 129, 0.02);
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .integration-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--background);
      border-radius: 12px;
    }

    .integration-icon svg,
    .integration-icon :global(svg) {
      width: 24px;
      height: 24px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.625rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 100px;
    }

    .status-badge.connected {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    .category-badge {
      font-size: 0.6875rem;
      font-weight: 500;
      text-transform: uppercase;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .category-badge.retail {
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
    }

    .category-badge.email {
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
    }

    .category-badge.ads {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .category-badge.analytics {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .category-badge.other {
      background: var(--background-subtle);
      color: var(--text-secondary);
    }

    .integration-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.375rem 0;
    }

    .integration-desc {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin: 0 0 1rem 0;
      line-height: 1.5;
    }

    .integration-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-light);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .meta-item svg {
      width: 14px;
      height: 14px;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.875rem;
      font-size: 0.8125rem;
      font-weight: 500;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn svg {
      width: 14px;
      height: 14px;
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, rgb(28, 46, 74) 0%, rgb(45, 75, 120) 100%);
      color: white;
    }

    .btn-secondary {
      background: white;
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    .btn-ghost {
      background: transparent;
      color: var(--text-muted);
    }

    .btn-ghost:hover {
      background: var(--background);
      color: var(--text-primary);
    }

    .btn-ghost.danger:hover {
      color: var(--error);
      background: rgba(239, 68, 68, 0.1);
    }

    /* Request Section */
    .request-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
      border: 1px dashed rgba(139, 92, 246, 0.3);
      border-radius: 14px;
    }

    .request-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 14px;
      color: var(--accent-purple);
    }

    .request-icon svg {
      width: 28px;
      height: 28px;
    }

    .request-content {
      flex: 1;
    }

    .request-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .request-desc {
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
export class IntegrationsComponent {
  searchQuery = '';
  activeCategory = 'all';
  lastSyncTime = '2 hours ago';

  categories = [
    { id: 'all', label: 'All', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
    { id: 'retail', label: 'Retail', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' },
    { id: 'email', label: 'Email', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { id: 'ads', label: 'Advertising', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
    { id: 'analytics', label: 'Analytics', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' }
  ];

  connectedIntegrationsList: Integration[] = [
    { id: '1', name: 'Amazon KDP', description: 'Import royalties and sales data from Kindle Direct Publishing', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>', category: 'retail', status: 'connected', lastSync: '2 hours ago' },
    { id: '2', name: 'MailerLite', description: 'Sync email campaigns and subscriber data', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>', category: 'email', status: 'connected', lastSync: '1 hour ago' }
  ];

  availableIntegrations: Integration[] = [
    { id: '3', name: 'Kobo Writing Life', description: 'Import sales and royalty data from Kobo', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', category: 'retail', status: 'disconnected' },
    { id: '4', name: 'Apple Books', description: 'Connect Apple Books for Authors data', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 4-3 4-6s-2.5-3-4-5c-1.5 2-3.5 3-4 3s-2.5-1-4-3c-1.5 2-4 2-4 5s1 6 4 6c1.25 0 2.5-1.06 4-1.06z"/><path d="M12 2v8"/></svg>', category: 'retail', status: 'disconnected' },
    { id: '5', name: 'ConvertKit', description: 'Email marketing automation platform', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>', category: 'email', status: 'disconnected' },
    { id: '6', name: 'Amazon Ads', description: 'Import AMS advertising spend and performance', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', category: 'ads', status: 'disconnected' },
    { id: '7', name: 'Facebook Ads', description: 'Track Facebook advertising campaigns', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>', category: 'ads', status: 'disconnected' },
    { id: '8', name: 'Google Analytics', description: 'Website traffic and conversion tracking', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>', category: 'analytics', status: 'disconnected' },
    { id: '9', name: 'BookFunnel', description: 'Reader magnet and book delivery service', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>', category: 'other', status: 'disconnected' }
  ];

  get connectedIntegrations(): Integration[] {
    if (this.activeCategory === 'all') return this.connectedIntegrationsList;
    return this.connectedIntegrationsList.filter(i => i.category === this.activeCategory);
  }

  get filteredAvailable(): Integration[] {
    let filtered = this.availableIntegrations;
    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(i => i.category === this.activeCategory);
    }
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.description.toLowerCase().includes(query)
      );
    }
    return filtered;
  }

  get connectedCount(): number {
    return this.connectedIntegrationsList.length;
  }

  getCategoryCount(categoryId: string): number {
    const all = [...this.connectedIntegrationsList, ...this.availableIntegrations];
    if (categoryId === 'all') return all.length;
    return all.filter(i => i.category === categoryId).length;
  }

  connectIntegration(integration: Integration): void {
    console.log('Connecting:', integration.name);
  }
}
