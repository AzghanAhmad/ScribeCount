import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HistoryItem {
  id: string;
  type: 'question' | 'report' | 'action' | 'insight';
  query: string;
  response?: string;
  timestamp: string;
  date: string;
  tags?: string[];
  saved?: boolean;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">Conversation History</h1>
          <p class="page-subtitle">Browse your past interactions with Hey ScribeCount</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="exportHistory()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <button class="btn btn-ghost" (click)="clearHistory()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Clear All
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="filters-row animate-fade-in-up">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" class="search-input" placeholder="Search your history..." [(ngModel)]="searchQuery">
        </div>
        <div class="filter-group">
          <select class="filter-select" [(ngModel)]="typeFilter">
            <option value="all">All Types</option>
            <option value="question">Questions</option>
            <option value="report">Reports</option>
            <option value="action">Actions</option>
            <option value="insight">Insights</option>
          </select>
          <select class="filter-select" [(ngModel)]="dateFilter">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <!-- History Timeline -->
      <div class="history-timeline">
        <div *ngFor="let group of groupedHistory" class="history-group animate-fade-in-up">
          <div class="date-header">
            <span class="date-label">{{ group.date }}</span>
            <span class="date-count">{{ group.items.length }} {{ group.items.length === 1 ? 'item' : 'items' }}</span>
          </div>

          <div class="history-items">
            <div *ngFor="let item of group.items" class="history-item" [class]="'type-' + item.type">
              <div class="item-timeline">
                <div class="timeline-icon" [class]="item.type">
                  <svg *ngIf="item.type === 'question'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <svg *ngIf="item.type === 'report'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  <svg *ngIf="item.type === 'action'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  <svg *ngIf="item.type === 'insight'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </div>
                <div class="timeline-line"></div>
              </div>

              <div class="item-content">
                <div class="item-header">
                  <span class="item-time">{{ item.timestamp }}</span>
                  <button class="save-btn" [class.saved]="item.saved" (click)="toggleSave(item)" title="Save">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                </div>

                <div class="item-query">
                  <span class="query-label">You asked:</span>
                  <p class="query-text">"{{ item.query }}"</p>
                </div>

                <div class="item-response" *ngIf="item.response">
                  <span class="response-label">ScribeCount:</span>
                  <p class="response-text">{{ item.response }}</p>
                </div>

                <div class="item-tags" *ngIf="item.tags && item.tags.length">
                  <span *ngFor="let tag of item.tags" class="tag">{{ tag }}</span>
                </div>

                <div class="item-actions">
                  <button class="action-btn" (click)="rerunQuery(item)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="23 4 23 10 17 10"/>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                    Run Again
                  </button>
                  <button class="action-btn" (click)="copyToClipboard(item)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copy
                  </button>
                  <button class="action-btn" (click)="deleteItem(item)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="groupedHistory.length === 0" class="empty-state animate-fade-in-up">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h3 class="empty-title">No history found</h3>
          <p class="empty-text">Your conversations with Hey ScribeCount will appear here.</p>
          <button class="btn btn-primary">Start a Conversation</button>
        </div>
      </div>

      <!-- Load More -->
      <div *ngIf="hasMore" class="load-more animate-fade-in-up">
        <button class="btn btn-secondary" (click)="loadMore()">Load More History</button>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 900px;
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
      gap: 0.5rem;
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
    }

    /* Filters */
    .filters-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .search-box {
      position: relative;
      flex: 1;
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
      padding: 0.625rem 2.5rem 0.625rem 0.875rem;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      font-size: 0.875rem;
      background: white;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
    }

    /* History Timeline */
    .history-timeline {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .history-group {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .date-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 0;
      margin-bottom: 0.5rem;
    }

    .date-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-primary);
      background: white;
      padding-right: 1rem;
    }

    .date-count {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .history-items {
      display: flex;
      flex-direction: column;
    }

    .history-item {
      display: flex;
      gap: 1rem;
      padding-bottom: 1.5rem;
    }

    .item-timeline {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    .timeline-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .timeline-icon svg {
      width: 18px;
      height: 18px;
    }

    .timeline-icon.question {
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
    }

    .timeline-icon.report {
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
    }

    .timeline-icon.action {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .timeline-icon.insight {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .timeline-line {
      width: 2px;
      flex: 1;
      background: var(--border-light);
      margin-top: 0.5rem;
    }

    .history-item:last-child .timeline-line {
      display: none;
    }

    .item-content {
      flex: 1;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 14px;
      padding: 1.25rem;
    }

    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .item-time {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .save-btn {
      width: 28px;
      height: 28px;
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

    .save-btn:hover {
      color: var(--warning);
    }

    .save-btn.saved {
      color: var(--warning);
    }

    .save-btn.saved svg {
      fill: var(--warning);
    }

    .save-btn svg {
      width: 16px;
      height: 16px;
    }

    .item-query {
      margin-bottom: 0.75rem;
    }

    .query-label,
    .response-label {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    .query-text {
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-primary);
      margin: 0.25rem 0 0 0;
      font-style: italic;
    }

    .item-response {
      padding: 0.875rem;
      background: var(--background);
      border-radius: 10px;
      margin-bottom: 0.75rem;
    }

    .response-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0.25rem 0 0 0;
      line-height: 1.6;
    }

    .item-tags {
      display: flex;
      gap: 0.375rem;
      margin-bottom: 0.75rem;
    }

    .tag {
      font-size: 0.6875rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
      border-radius: 4px;
    }

    .item-actions {
      display: flex;
      gap: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-light);
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.625rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-muted);
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: var(--background);
      color: var(--text-primary);
    }

    .action-btn svg {
      width: 14px;
      height: 14px;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      background: var(--background);
      border-radius: 16px;
      color: var(--text-muted);
    }

    .empty-icon svg {
      width: 32px;
      height: 32px;
    }

    .empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
    }

    .empty-text {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0 0 1.5rem 0;
    }

    /* Load More */
    .load-more {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
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
export class HistoryComponent {
  searchQuery = '';
  typeFilter = 'all';
  dateFilter = 'all';
  hasMore = true;

  historyItems: HistoryItem[] = [
    { id: '1', type: 'question', query: 'How did my romance titles perform last month?', response: 'Your romance titles generated $4,847 in revenue last month, a 12% increase from the previous month. "The Midnight Kiss" was your top performer with $1,234 in sales.', timestamp: '2:34 PM', date: 'Today', tags: ['Romance', 'Monthly Report'], saved: true },
    { id: '2', type: 'report', query: 'Generate Q4 royalties report', response: 'Your Q4 royalties report has been generated. Total revenue: $24,847 across 47 titles. Amazon contributed 68% of total earnings.', timestamp: '11:20 AM', date: 'Today', tags: ['Report', 'Q4'] },
    { id: '3', type: 'insight', query: 'What marketing channels are working best?', response: 'Email marketing is your most effective channel, driving 34% of sales with a 4.2x ROI. BookBub promotions showed the highest single-day impact.', timestamp: '9:45 AM', date: 'Today', tags: ['Marketing', 'Analytics'] },
    { id: '4', type: 'question', query: 'Compare KU page reads to wide sales', response: 'KU page reads contributed $8,423 (34%) to your monthly revenue, while wide sales generated $16,424 (66%). Your wide distribution is currently outperforming KU.', timestamp: '4:15 PM', date: 'Yesterday', tags: ['KU', 'Wide'] },
    { id: '5', type: 'action', query: 'Schedule a weekly sales report', response: 'Weekly sales report scheduled for every Monday at 9:00 AM. You will receive it via email and in-app notification.', timestamp: '2:00 PM', date: 'Yesterday', tags: ['Scheduled'] },
    { id: '6', type: 'question', query: 'Which book should I promote next month?', response: 'Based on trend analysis and performance data, "The Lost Letter" shows the highest potential. It has strong reviews, good sell-through, and seasonal relevance for February.', timestamp: '10:30 AM', date: 'January 28, 2025', tags: ['Recommendations'], saved: true }
  ];

  get groupedHistory(): { date: string; items: HistoryItem[] }[] {
    const filtered = this.filteredItems;
    const groups: { [key: string]: HistoryItem[] } = {};

    filtered.forEach(item => {
      if (!groups[item.date]) {
        groups[item.date] = [];
      }
      groups[item.date].push(item);
    });

    return Object.entries(groups).map(([date, items]) => ({ date, items }));
  }

  get filteredItems(): HistoryItem[] {
    return this.historyItems.filter(item => {
      const matchesSearch = !this.searchQuery ||
        item.query.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (item.response && item.response.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchesType = this.typeFilter === 'all' || item.type === this.typeFilter;
      return matchesSearch && matchesType;
    });
  }

  toggleSave(item: HistoryItem): void {
    item.saved = !item.saved;
  }

  rerunQuery(item: HistoryItem): void {
    console.log('Re-running query:', item.query);
  }

  copyToClipboard(item: HistoryItem): void {
    const text = `Q: ${item.query}\n\nA: ${item.response || 'No response'}`;
    navigator.clipboard.writeText(text);
  }

  deleteItem(item: HistoryItem): void {
    this.historyItems = this.historyItems.filter(h => h.id !== item.id);
  }

  exportHistory(): void {
    console.log('Exporting history...');
  }

  clearHistory(): void {
    if (confirm('Are you sure you want to clear all history?')) {
      this.historyItems = [];
    }
  }

  loadMore(): void {
    console.log('Loading more...');
    this.hasMore = false;
  }
}
