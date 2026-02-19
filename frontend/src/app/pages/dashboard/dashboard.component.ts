import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SmartLinkService } from '../../services/smart-link.service';
import { SmartLink } from '../../models/smart-link.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <!-- Welcome Section -->
      <div class="welcome-section animate-fade-in-up">
        <div class="welcome-content">
          <h1 class="welcome-title">Welcome back, Sarah 👋</h1>
          <p class="welcome-subtitle">Here's how your smart links are performing today.</p>
        </div>
        <button class="btn-create" routerLink="/create">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Create New Smart Link
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card animate-fade-in-up" style="animation-delay: 0.1s">
          <div class="stat-icon-wrap blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <div class="stat-data">
            <span class="stat-value">{{ stats().totalLinks }}</span>
            <span class="stat-label">Total Smart Links</span>
          </div>
        </div>
        <div class="stat-card gradient animate-fade-in-up" style="animation-delay: 0.15s">
          <div class="stat-icon-wrap white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </div>
          <div class="stat-data">
            <span class="stat-value">{{ stats().totalClicks | number }}</span>
            <span class="stat-label">Total Clicks</span>
          </div>
        </div>
        <div class="stat-card animate-fade-in-up" style="animation-delay: 0.2s">
          <div class="stat-icon-wrap purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <div class="stat-data">
            <span class="stat-value">{{ stats().topCountry }}</span>
            <span class="stat-label">Top Country</span>
          </div>
        </div>
        <div class="stat-card animate-fade-in-up" style="animation-delay: 0.25s">
          <div class="stat-icon-wrap teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <div class="stat-data">
            <span class="stat-value">{{ stats().topRetailer }}</span>
            <span class="stat-label">Top Retailer</span>
          </div>
        </div>
      </div>

      <!-- Smart Links Table -->
      <div class="table-card animate-fade-in-up" style="animation-delay: 0.3s">
        <div class="table-header">
          <h2 class="table-title">Your Smart Links</h2>
          <div class="table-actions">
            <div class="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" placeholder="Search links..." class="search-input" (input)="filterLinks($event)">
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="links-table">
            <thead>
              <tr>
                <th>Book Name</th>
                <th>Short Link URL</th>
                <th>Total Clicks</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let link of filteredLinks; let i = index" class="table-row" [style.animationDelay]="(0.35 + i * 0.05) + 's'">
                <td>
                  <div class="book-cell">
                    <div class="book-cover-mini">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                      </svg>
                    </div>
                    <div class="book-cell-info">
                      <span class="book-cell-title">{{ link.bookTitle }}</span>
                      <span class="book-cell-formats">{{ getFormatLabels(link) }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="url-cell">
                    <code class="short-url">{{ link.shortUrl }}</code>
                    <button class="copy-btn-mini" (click)="copyUrl(link.shortUrl)" [title]="'Copy link'">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    </button>
                  </div>
                </td>
                <td>
                  <span class="clicks-value">{{ link.totalClicks | number }}</span>
                </td>
                <td>
                  <span class="badge"
                        [class.badge-active]="link.status === 'active'"
                        [class.badge-scheduled]="link.status === 'scheduled'"
                        [class.badge-expired]="link.status === 'expired'">
                    {{ link.status }}
                  </span>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="action-btn" [routerLink]="'/edit/' + link.id" title="Edit">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="action-btn" [routerLink]="'/analytics/' + link.id" title="Analytics">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="20" x2="18" y2="10"/>
                        <line x1="12" y1="20" x2="12" y2="4"/>
                        <line x1="6" y1="20" x2="6" y2="14"/>
                      </svg>
                    </button>
                    <button class="action-btn danger" (click)="deleteLink(link.id)" title="Delete">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-empty" *ngIf="filteredLinks.length === 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <p class="empty-text">No smart links found. Create your first one!</p>
          <button class="btn-create small" routerLink="/create">Create Smart Link</button>
        </div>
      </div>

      <!-- Toast notification -->
      <div class="toast" *ngIf="showToast" [class.show]="showToast">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ toastMessage }}
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1400px;
      animation: fadeIn 0.5s ease-out;
    }

    /* Welcome Section */
    .welcome-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      padding: 2rem 2.5rem;
      background: linear-gradient(135deg, rgb(28, 46, 74) 0%, rgb(45, 75, 120) 50%, rgba(99, 102, 241, 0.8) 100%);
      border-radius: 20px;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .welcome-section::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
      border-radius: 50%;
    }

    .welcome-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.375rem 0;
      letter-spacing: -0.02em;
    }

    .welcome-subtitle {
      font-size: 1rem;
      color: rgba(255,255,255,0.75);
      margin: 0;
    }

    .btn-create {
      display: inline-flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.875rem 1.75rem;
      background: white;
      color: rgb(28, 46, 74);
      border: none;
      border-radius: 12px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      text-decoration: none;
      white-space: nowrap;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .btn-create:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    }

    .btn-create.small {
      padding: 0.75rem 1.5rem;
      font-size: 0.875rem;
      background: var(--gradient-primary);
      color: white;
    }

    .btn-icon {
      width: 20px;
      height: 20px;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.5rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
      opacity: 0;
      animation: fadeInUp 0.5s ease-out forwards;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.08);
    }

    .stat-card.gradient {
      background: linear-gradient(135deg, rgb(28, 46, 74) 0%, rgb(45, 75, 120) 100%);
      border: none;
      color: white;
    }

    .stat-card.gradient .stat-label {
      color: rgba(255,255,255,0.7);
    }

    .stat-icon-wrap {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      flex-shrink: 0;
    }

    .stat-icon-wrap svg {
      width: 24px;
      height: 24px;
    }

    .stat-icon-wrap.blue {
      background: rgba(59, 130, 246, 0.12);
      color: #3b82f6;
    }

    .stat-icon-wrap.white {
      background: rgba(255,255,255,0.2);
      color: white;
    }

    .stat-icon-wrap.purple {
      background: rgba(139, 92, 246, 0.12);
      color: #8b5cf6;
    }

    .stat-icon-wrap.teal {
      background: rgba(20, 184, 166, 0.12);
      color: #14b8a6;
    }

    .stat-data {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    .stat-label {
      font-size: 0.8125rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Table Card */
    .table-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      overflow: hidden;
      opacity: 0;
      animation: fadeInUp 0.5s ease-out forwards;
    }

    .table-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 1.5rem 1rem;
    }

    .table-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--background);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      transition: all 0.2s ease;
    }

    .search-box:focus-within {
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-icon {
      width: 16px;
      height: 16px;
      color: var(--text-muted);
      flex-shrink: 0;
    }

    .search-input {
      border: none;
      background: transparent;
      font-size: 0.875rem;
      color: var(--text-primary);
      outline: none;
      width: 200px;
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .table-responsive {
      overflow-x: auto;
    }

    .links-table {
      width: 100%;
      border-collapse: collapse;
    }

    .links-table th {
      padding: 0.75rem 1.5rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-light);
      background: var(--background);
    }

    .links-table td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-light);
      font-size: 0.875rem;
    }

    .table-row {
      transition: background 0.2s ease;
    }

    .table-row:hover {
      background: rgba(59, 130, 246, 0.03);
    }

    .table-row:last-child td {
      border-bottom: none;
    }

    /* Book cell */
    .book-cell {
      display: flex;
      align-items: center;
      gap: 0.875rem;
    }

    .book-cover-mini {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .book-cover-mini svg {
      width: 20px;
      height: 20px;
      color: var(--accent-blue);
    }

    .book-cell-info {
      display: flex;
      flex-direction: column;
    }

    .book-cell-title {
      font-weight: 600;
      color: var(--text-primary);
    }

    .book-cell-formats {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* URL cell */
    .url-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .short-url {
      font-size: 0.8125rem;
      color: var(--accent-blue);
      background: rgba(59, 130, 246, 0.06);
      padding: 0.25rem 0.625rem;
      border-radius: 6px;
      font-family: 'Inter', monospace;
    }

    .copy-btn-mini {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .copy-btn-mini svg {
      width: 14px;
      height: 14px;
      color: var(--text-muted);
    }

    .copy-btn-mini:hover {
      background: var(--accent-blue);
      border-color: var(--accent-blue);
    }

    .copy-btn-mini:hover svg {
      color: white;
    }

    .clicks-value {
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Action buttons */
    .action-btns {
      display: flex;
      gap: 0.375rem;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--border-light);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-btn svg {
      width: 15px;
      height: 15px;
      color: var(--text-muted);
    }

    .action-btn:hover {
      background: var(--accent-blue);
      border-color: var(--accent-blue);
    }

    .action-btn:hover svg {
      color: white;
    }

    .action-btn.danger:hover {
      background: var(--error);
      border-color: var(--error);
    }

    /* Empty State */
    .table-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem;
      text-align: center;
    }

    .empty-icon {
      width: 48px;
      height: 48px;
      color: var(--text-muted);
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-text {
      font-size: 0.9375rem;
      color: var(--text-muted);
      margin: 0 0 1.25rem 0;
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.25rem;
      background: rgb(28, 46, 74);
      color: white;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
      box-shadow: 0 12px 32px rgba(0,0,0,0.2);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
    }

    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }

    .toast svg {
      width: 18px;
      height: 18px;
      color: #6ee7b7;
    }

    @media (max-width: 1200px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: 1fr; }
      .welcome-section { flex-direction: column; text-align: center; gap: 1.25rem; }
      .search-input { width: 150px; }
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

    .animate-fade-in-up {
      opacity: 0;
      animation: fadeInUp 0.5s ease-out forwards;
    }
  `]
})
export class DashboardComponent {
  stats = this.smartLinkService.dashboardStats;
  filteredLinks: SmartLink[] = [];
  showToast = false;
  toastMessage = '';

  constructor(private smartLinkService: SmartLinkService, private router: Router) {
    this.filteredLinks = this.smartLinkService.links();
  }

  getFormatLabels(link: SmartLink): string {
    return link.formats.map(f => f.type.charAt(0).toUpperCase() + f.type.slice(1)).join(', ');
  }

  filterLinks(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (!query) {
      this.filteredLinks = this.smartLinkService.links();
    } else {
      this.filteredLinks = this.smartLinkService.links().filter(l =>
        l.bookTitle.toLowerCase().includes(query) ||
        l.shortUrl.toLowerCase().includes(query)
      );
    }
  }

  copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    this.showToastMsg('Link copied to clipboard!');
  }

  deleteLink(id: string) {
    this.smartLinkService.deleteLink(id);
    this.filteredLinks = this.smartLinkService.links();
    this.showToastMsg('Smart link deleted');
  }

  private showToastMsg(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2500);
  }
}
