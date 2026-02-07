import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AuditLog {
  id: string;
  action: string;
  category: 'auth' | 'data' | 'settings' | 'api' | 'integration';
  user: string;
  ip?: string;
  timestamp: string;
  details?: string;
  status: 'success' | 'warning' | 'error';
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">Audit Logs</h1>
          <p class="page-subtitle">Track all activity and changes in your account</p>
        </div>
        <button class="btn btn-secondary" (click)="exportLogs()">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export Logs
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-row animate-fade-in-up">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" class="search-input" placeholder="Search logs..." [(ngModel)]="searchQuery">
        </div>
        <div class="filter-group">
          <select class="filter-select" [(ngModel)]="categoryFilter">
            <option value="all">All Categories</option>
            <option value="auth">Authentication</option>
            <option value="data">Data Access</option>
            <option value="settings">Settings</option>
            <option value="api">API</option>
            <option value="integration">Integrations</option>
          </select>
          <select class="filter-select" [(ngModel)]="dateFilter">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
          <select class="filter-select" [(ngModel)]="statusFilter">
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-bar animate-fade-in-up" style="animation-delay: 0.05s">
        <div class="stat">
          <span class="stat-value">{{ filteredLogs.length }}</span>
          <span class="stat-label">Total Events</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-value success">{{ successCount }}</span>
          <span class="stat-label">Successful</span>
        </div>
        <div class="stat">
          <span class="stat-value warning">{{ warningCount }}</span>
          <span class="stat-label">Warnings</span>
        </div>
        <div class="stat">
          <span class="stat-value error">{{ errorCount }}</span>
          <span class="stat-label">Errors</span>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="logs-table animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="table-header">
          <span class="col-time">Time</span>
          <span class="col-action">Action</span>
          <span class="col-user">User</span>
          <span class="col-category">Category</span>
          <span class="col-status">Status</span>
          <span class="col-details">Details</span>
        </div>
        <div *ngFor="let log of filteredLogs; let i = index" 
             class="table-row"
             [class.expandable]="log.details"
             [class.expanded]="expandedLog === log.id"
             (click)="log.details && toggleExpand(log.id)">
          <span class="col-time">{{ log.timestamp }}</span>
          <span class="col-action">
            <span class="action-icon" [class]="log.category">
              <svg *ngIf="log.category === 'auth'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <svg *ngIf="log.category === 'data'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
              <svg *ngIf="log.category === 'settings'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.32 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <svg *ngIf="log.category === 'api'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
              <svg *ngIf="log.category === 'integration'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </span>
            {{ log.action }}
          </span>
          <span class="col-user">
            <span class="user-avatar">{{ log.user.charAt(0) }}</span>
            {{ log.user }}
          </span>
          <span class="col-category">
            <span class="category-badge" [class]="log.category">{{ log.category }}</span>
          </span>
          <span class="col-status">
            <span class="status-indicator" [class]="log.status"></span>
            {{ log.status }}
          </span>
          <span class="col-details">
            <svg *ngIf="log.details" class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
          <div *ngIf="log.details && expandedLog === log.id" class="row-details" (click)="$event.stopPropagation()">
            <div class="details-content">
              <span class="details-label">Details:</span>
              <p class="details-text">{{ log.details }}</p>
              <span *ngIf="log.ip" class="details-ip">IP: {{ log.ip }}</span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredLogs.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <span class="empty-title">No logs found</span>
          <span class="empty-text">Try adjusting your filters</span>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="filteredLogs.length > 0" class="pagination animate-fade-in-up" style="animation-delay: 0.15s">
        <span class="page-info">Showing 1-{{ filteredLogs.length }} of {{ totalLogs }} logs</span>
        <div class="page-controls">
          <button class="page-btn" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <span class="page-dots">...</span>
          <button class="page-btn">12</button>
          <button class="page-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
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

    .btn-secondary {
      background: white;
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    /* Filters */
    .filters-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .search-box {
      position: relative;
      flex: 1;
      min-width: 250px;
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

    .filter-group {
      display: flex;
      gap: 0.5rem;
    }

    .filter-select {
      padding: 0.625rem 2rem 0.625rem 0.875rem;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      font-size: 0.875rem;
      background: white;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.5rem center;
    }

    /* Stats Bar */
    .stats-bar {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem 1.5rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }

    .stat {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .stat-value.success { color: var(--success); }
    .stat-value.warning { color: var(--warning); }
    .stat-value.error { color: var(--error); }

    .stat-label {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .stat-divider {
      width: 1px;
      height: 24px;
      background: var(--border-light);
    }

    /* Logs Table */
    .logs-table {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 1.5rem;
    }

    .table-header,
    .table-row {
      display: grid;
      grid-template-columns: 130px 1fr 150px 120px 100px 50px;
      gap: 1rem;
      padding: 1rem 1.5rem;
      align-items: center;
    }

    .table-header {
      background: var(--background-subtle);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    .table-row {
      border-bottom: 1px solid var(--border-light);
      font-size: 0.875rem;
      position: relative;
      transition: background 0.2s;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .table-row.expandable {
      cursor: pointer;
    }

    .table-row.expandable:hover {
      background: var(--background);
    }

    .table-row.expanded {
      background: var(--primary-light);
    }

    .col-time {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .col-action {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .action-icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
    }

    .action-icon svg {
      width: 14px;
      height: 14px;
    }

    .action-icon.auth {
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
    }

    .action-icon.data {
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
    }

    .action-icon.settings {
      background: rgba(100, 116, 139, 0.1);
      color: var(--text-secondary);
    }

    .action-icon.api {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .action-icon.integration {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .col-user {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-avatar {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      color: white;
      font-size: 0.6875rem;
      font-weight: 600;
      border-radius: 6px;
    }

    .category-badge {
      font-size: 0.6875rem;
      font-weight: 500;
      text-transform: capitalize;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .category-badge.auth {
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
    }

    .category-badge.data {
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
    }

    .category-badge.settings {
      background: var(--background-subtle);
      color: var(--text-secondary);
    }

    .category-badge.api {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .category-badge.integration {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .col-status {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      text-transform: capitalize;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-indicator.success { background: var(--success); }
    .status-indicator.warning { background: var(--warning); }
    .status-indicator.error { background: var(--error); }

    .expand-icon {
      width: 16px;
      height: 16px;
      color: var(--text-muted);
      transition: transform 0.2s;
    }

    .table-row.expanded .expand-icon {
      transform: rotate(180deg);
    }

    .row-details {
      grid-column: 1 / -1;
      padding-top: 1rem;
      margin-top: 1rem;
      border-top: 1px solid var(--border-light);
    }

    .details-content {
      padding: 0.875rem;
      background: white;
      border-radius: 8px;
    }

    .details-label {
      display: block;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }

    .details-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0 0 0.5rem 0;
    }

    .details-ip {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-family: monospace;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem;
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

    /* Pagination */
    .pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .page-info {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .page-controls {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .page-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .page-btn:hover:not(:disabled) {
      border-color: var(--primary);
      color: var(--primary);
    }

    .page-btn.active {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-btn svg {
      width: 16px;
      height: 16px;
    }

    .page-dots {
      padding: 0 0.5rem;
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
export class AuditLogsComponent {
  searchQuery = '';
  categoryFilter = 'all';
  dateFilter = 'week';
  statusFilter = 'all';
  expandedLog: string | null = null;
  totalLogs = 247;

  logs: AuditLog[] = [
    { id: '1', action: 'User Login', category: 'auth', user: 'ScribeCount User', ip: '192.168.1.1', timestamp: 'Today, 2:34 PM', status: 'success' },
    { id: '2', action: 'Report Generated', category: 'data', user: 'ScribeCount User', timestamp: 'Today, 2:15 PM', details: 'Monthly Royalties Report for January 2025 generated and downloaded.', status: 'success' },
    { id: '3', action: 'API Key Created', category: 'api', user: 'ScribeCount User', timestamp: 'Today, 11:30 AM', details: 'New production API key created with read permissions.', status: 'success' },
    { id: '4', action: 'Integration Sync Failed', category: 'integration', user: 'System', timestamp: 'Today, 9:00 AM', details: 'Amazon KDP sync failed due to rate limiting. Will retry in 15 minutes.', status: 'error' },
    { id: '5', action: 'Settings Updated', category: 'settings', user: 'ScribeCount User', timestamp: 'Yesterday, 4:45 PM', details: 'Email notification preferences updated.', status: 'success' },
    { id: '6', action: 'Failed Login Attempt', category: 'auth', user: 'Unknown', ip: '203.0.113.42', timestamp: 'Yesterday, 2:12 AM', details: 'Failed login attempt with incorrect password. IP has been temporarily blocked.', status: 'warning' },
    { id: '7', action: 'Data Export', category: 'data', user: 'ScribeCount User', timestamp: 'Jan 28, 3:20 PM', details: 'Full royalties data exported to CSV format.', status: 'success' },
    { id: '8', action: 'MailerLite Connected', category: 'integration', user: 'ScribeCount User', timestamp: 'Jan 27, 10:15 AM', details: 'Successfully connected MailerLite integration.', status: 'success' }
  ];

  get filteredLogs(): AuditLog[] {
    return this.logs.filter(log => {
      const matchesSearch = !this.searchQuery ||
        log.action.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.categoryFilter === 'all' || log.category === this.categoryFilter;
      const matchesStatus = this.statusFilter === 'all' || log.status === this.statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  get successCount(): number {
    return this.filteredLogs.filter(l => l.status === 'success').length;
  }

  get warningCount(): number {
    return this.filteredLogs.filter(l => l.status === 'warning').length;
  }

  get errorCount(): number {
    return this.filteredLogs.filter(l => l.status === 'error').length;
  }

  toggleExpand(id: string): void {
    this.expandedLog = this.expandedLog === id ? null : id;
  }

  exportLogs(): void {
    console.log('Exporting logs...');
  }
}
