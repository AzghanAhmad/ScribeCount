import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface StatCard {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: string;
  gradient?: boolean;
}

interface RecentActivity {
  type: 'sale' | 'email' | 'report' | 'alert';
  title: string;
  description: string;
  time: string;
  amount?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">Dashboard</h1>
            <p class="page-subtitle">Welcome back! Here's what's happening with your royalties.</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Last 30 Days
            </button>
            <button class="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export Report
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards Grid -->
      <div class="stats-grid">
        <div *ngFor="let stat of stats; let i = index" 
             class="stat-card animate-fade-in-up"
             [class.gradient]="stat.gradient"
             [style.animationDelay]="(i * 0.1) + 's'">
          <div class="stat-header">
            <div class="stat-icon" [innerHTML]="stat.icon"></div>
            <div class="stat-change" [class]="stat.changeType">
              <svg *ngIf="stat.changeType === 'up'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              <svg *ngIf="stat.changeType === 'down'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              {{ stat.change }}
            </div>
          </div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="charts-grid">
        <!-- Revenue Trend Chart -->
        <div class="chart-card animate-fade-in-up" style="animation-delay: 0.4s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Revenue Trend</h3>
              <p class="chart-subtitle">Monthly royalties over the past year</p>
            </div>
            <div class="chart-actions">
              <button class="chart-btn" [class.active]="chartPeriod === 'monthly'" (click)="switchChartPeriod('monthly')">Monthly</button>
              <button class="chart-btn" [class.active]="chartPeriod === 'weekly'" (click)="switchChartPeriod('weekly')">Weekly</button>
            </div>
          </div>
          <div class="chart-container">
            <canvas #revenueChart></canvas>
          </div>
        </div>

        <!-- Platform Distribution -->
        <div class="chart-card animate-fade-in-up" style="animation-delay: 0.5s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Platform Distribution</h3>
              <p class="chart-subtitle">Revenue breakdown by platform</p>
            </div>
          </div>
          <div class="chart-container doughnut-container">
            <canvas #platformChart></canvas>
            <div class="doughnut-center">
              <span class="doughnut-value">$24.8K</span>
              <span class="doughnut-label">Total Revenue</span>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item" *ngFor="let platform of platforms">
              <span class="legend-color" [style.backgroundColor]="platform.color"></span>
              <span class="legend-label">{{ platform.name }}</span>
              <span class="legend-value">{{ platform.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Second Charts Row -->
      <div class="charts-grid charts-grid-3">
        <!-- Format Performance -->
        <div class="chart-card chart-card-flex animate-fade-in-up" style="animation-delay: 0.6s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Format Performance</h3>
              <p class="chart-subtitle">Sales by book format</p>
            </div>
          </div>
          <div class="chart-container chart-container-full">
            <canvas #formatChart></canvas>
          </div>
        </div>

        <!-- Top Books -->
        <div class="chart-card animate-fade-in-up" style="animation-delay: 0.7s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Top Performing Books</h3>
              <p class="chart-subtitle">Best sellers this month</p>
            </div>
          </div>
          <div class="top-books-list">
            <div *ngFor="let book of topBooks; let i = index" class="book-item">
              <span class="book-rank" [class.gold]="i === 0" [class.silver]="i === 1" [class.bronze]="i === 2">{{ i + 1 }}</span>
              <div class="book-info">
                <span class="book-title">{{ book.title }}</span>
                <span class="book-author">{{ book.author }}</span>
              </div>
              <div class="book-stats">
                <span class="book-revenue">{{ book.revenue }}</span>
                <span class="book-sales">{{ book.sales }} sales</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Attribution Flow -->
        <div class="chart-card chart-card-flex animate-fade-in-up" style="animation-delay: 0.8s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Attribution Sources</h3>
              <p class="chart-subtitle">Where your sales come from</p>
            </div>
          </div>
          <div class="chart-container chart-container-full">
            <canvas #attributionChart></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Activity & Quick Actions -->
      <div class="bottom-grid">
        <!-- Recent Activity -->
        <div class="chart-card animate-fade-in-up" style="animation-delay: 0.9s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Recent Activity</h3>
              <p class="chart-subtitle">Latest events and updates</p>
            </div>
            <a href="#" class="view-all-link">View All</a>
          </div>
          <div class="activity-list">
            <div *ngFor="let activity of recentActivity" class="activity-item">
              <div class="activity-icon" [class]="activity.type">
                <svg *ngIf="activity.type === 'sale'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <svg *ngIf="activity.type === 'email'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <svg *ngIf="activity.type === 'report'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <svg *ngIf="activity.type === 'alert'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div class="activity-content">
                <span class="activity-title">{{ activity.title }}</span>
                <span class="activity-description">{{ activity.description }}</span>
              </div>
              <div class="activity-meta">
                <span class="activity-time">{{ activity.time }}</span>
                <span *ngIf="activity.amount" class="activity-amount">{{ activity.amount }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions & Insights -->
        <div class="chart-card animate-fade-in-up" style="animation-delay: 1s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Quick Actions</h3>
              <p class="chart-subtitle">Common tasks at your fingertips</p>
            </div>
          </div>
          <div class="quick-actions-grid">
            <button class="quick-action" (click)="openModal('newReport')">
              <div class="action-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
              </div>
              <span class="action-label">New Report</span>
            </button>
            <button class="quick-action" (click)="openModal('sendCampaign')">
              <div class="action-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <span class="action-label">Send Campaign</span>
            </button>
            <button class="quick-action" (click)="openModal('createLink')">
              <div class="action-icon teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </div>
              <span class="action-label">Create Link</span>
            </button>
            <button class="quick-action" (click)="openModal('scheduleBriefing')">
              <div class="action-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <span class="action-label">Schedule Briefing</span>
            </button>
          </div>

          <div class="insights-section">
            <h4 class="insights-title">💡 AI Insights</h4>
            <div class="insight-card">
              <p class="insight-text">Your <strong>email campaigns</strong> drove <strong>23% more sales</strong> this month compared to last month. Consider increasing frequency.</p>
            </div>
            <div class="insight-card">
              <p class="insight-text"><strong>Amazon KU</strong> revenue is up <strong>15%</strong>. Your page read rate has improved significantly.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Overlay -->
      <div class="modal-overlay" *ngIf="activeModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="closeModal()">×</button>
          
          <!-- New Report Modal -->
          <div *ngIf="activeModal === 'newReport'" class="modal-body">
            <h2 class="modal-title">Create New Report</h2>
            <p class="modal-subtitle">Generate a custom report for your book sales</p>
            <div class="modal-form">
              <label class="form-label">Report Name</label>
              <input type="text" class="form-input" placeholder="Q1 Sales Report">
              <label class="form-label">Date Range</label>
              <select class="form-input">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Custom range</option>
              </select>
              <label class="form-label">Metrics to Include</label>
              <div class="checkbox-group">
                <label><input type="checkbox" checked> Revenue</label>
                <label><input type="checkbox" checked> Sales Count</label>
                <label><input type="checkbox"> Page Reads</label>
                <label><input type="checkbox"> Royalties</label>
              </div>
              <button class="modal-btn primary" (click)="closeModal()">Generate Report</button>
            </div>
          </div>

          <!-- Send Campaign Modal -->
          <div *ngIf="activeModal === 'sendCampaign'" class="modal-body">
            <h2 class="modal-title">Send Email Campaign</h2>
            <p class="modal-subtitle">Create and send a new email to your subscribers</p>
            <div class="modal-form">
              <label class="form-label">Campaign Name</label>
              <input type="text" class="form-input" placeholder="New Release Announcement">
              <label class="form-label">Subject Line</label>
              <input type="text" class="form-input" placeholder="🎉 My New Book is Live!">
              <label class="form-label">Subscriber List</label>
              <select class="form-input">
                <option>All Subscribers (12,847)</option>
                <option>VIP Readers (1,234)</option>
                <option>New Subscribers (892)</option>
              </select>
              <button class="modal-btn primary" (click)="closeModal()">Create Campaign</button>
            </div>
          </div>

          <!-- Create Link Modal -->
          <div *ngIf="activeModal === 'createLink'" class="modal-body">
            <h2 class="modal-title">Create Tracking Link</h2>
            <p class="modal-subtitle">Generate a trackable link for your promotions</p>
            <div class="modal-form">
              <label class="form-label">Link Name</label>
              <input type="text" class="form-input" placeholder="BookBub Promo Link">
              <label class="form-label">Destination URL</label>
              <input type="text" class="form-input" placeholder="https://amazon.com/dp/...">
              <label class="form-label">Campaign Source</label>
              <select class="form-input">
                <option>Email</option>
                <option>Social Media</option>
                <option>BookBub</option>
                <option>Other</option>
              </select>
              <button class="modal-btn primary" (click)="closeModal()">Create Link</button>
            </div>
          </div>

          <!-- Schedule Briefing Modal -->
          <div *ngIf="activeModal === 'scheduleBriefing'" class="modal-body">
            <h2 class="modal-title">Schedule Briefing</h2>
            <p class="modal-subtitle">Set up automated report delivery</p>
            <div class="modal-form">
              <label class="form-label">Briefing Name</label>
              <input type="text" class="form-input" placeholder="Weekly Sales Summary">
              <label class="form-label">Frequency</label>
              <select class="form-input">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
              <label class="form-label">Delivery Time</label>
              <input type="time" class="form-input" value="09:00">
              <label class="form-label">Email To</label>
              <input type="email" class="form-input" placeholder="your@email.com">
              <button class="modal-btn primary" (click)="closeModal()">Schedule Briefing</button>
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

    /* Page Header */
    .page-header {
      margin-bottom: 1rem;
    }

    .header-content {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.5rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
      letter-spacing: -0.02em;
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

    .btn-secondary {
      background: white;
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .btn-secondary:hover {
      background: var(--background);
      border-color: var(--primary);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }

    .stat-card {
      position: relative;
      padding: 1.5rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      transition: all 0.3s ease;
      opacity: 0;
      animation: fadeInUp 0.5s ease-out forwards;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    }

    .stat-card:hover::before {
      transform: scaleX(1);
    }

    .stat-card.gradient {
      background: linear-gradient(135deg, rgb(28, 46, 74) 0%, rgb(45, 75, 120) 100%);
      border: none;
      color: white;
    }

    .stat-card.gradient::before {
      display: none;
    }

    .stat-card.gradient .stat-label {
      color: rgba(255, 255, 255, 0.7);
    }

    .stat-card.gradient .stat-value {
      color: white;
    }

    .stat-card.gradient .stat-change.up {
      color: #6ee7b7;
    }

    .stat-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
      border-radius: 12px;
    }

    .stat-card.gradient .stat-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    .stat-icon svg,
    .stat-icon :global(svg) {
      width: 24px;
      height: 24px;
      color: rgb(28, 46, 74);
    }

    .stat-card.gradient .stat-icon svg,
    .stat-card.gradient .stat-icon :global(svg) {
      color: white;
    }

    .stat-change {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
    }

    .stat-change svg {
      width: 14px;
      height: 14px;
    }

    .stat-change.up {
      color: var(--trend-up);
      background: rgba(16, 185, 129, 0.1);
    }

    .stat-change.down {
      color: var(--trend-down);
      background: rgba(239, 68, 68, 0.1);
    }

    .stat-change.neutral {
      color: var(--text-muted);
      background: var(--background-subtle);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
      margin-bottom: 0.25rem;
      letter-spacing: -0.02em;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Charts Grid */
    .charts-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .charts-grid-3 {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 1200px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }

      .charts-grid-3 {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .charts-grid-3 {
        grid-template-columns: 1fr;
      }
    }

    .chart-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      opacity: 0;
      animation: fadeInUp 0.5s ease-out forwards;
    }

    .chart-card-flex {
      display: flex;
      flex-direction: column;
    }

    .chart-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .chart-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .chart-subtitle {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin: 0;
    }

    .chart-actions {
      display: flex;
      gap: 0.25rem;
      background: var(--background-subtle);
      padding: 0.25rem;
      border-radius: 8px;
    }

    .chart-btn {
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-muted);
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .chart-btn:hover {
      color: var(--text-primary);
    }

    .chart-btn.active {
      background: white;
      color: var(--text-primary);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .chart-container {
      position: relative;
      height: 280px;
    }

    .chart-container-full {
      height: calc(100% - 60px);
      min-height: 200px;
      flex: 1;
    }

    .doughnut-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
    }

    .doughnut-center {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .doughnut-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .doughnut-label {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-light);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
    }

    .legend-color {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .legend-label {
      color: var(--text-secondary);
    }

    .legend-value {
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Top Books List */
    .top-books-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .book-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem;
      background: var(--background);
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .book-item:hover {
      background: var(--primary-light);
    }

    .book-rank {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 8px;
      background: var(--background-subtle);
      color: var(--text-muted);
    }

    .book-rank.gold {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
    }

    .book-rank.silver {
      background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
      color: white;
    }

    .book-rank.bronze {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      color: white;
    }

    .book-info {
      flex: 1;
      min-width: 0;
    }

    .book-title {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .book-author {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .book-stats {
      text-align: right;
    }

    .book-revenue {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .book-sales {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* Bottom Grid */
    .bottom-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 1200px) {
      .bottom-grid {
        grid-template-columns: 1fr;
      }
    }

    .view-all-link {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--accent-blue);
      text-decoration: none;
    }

    .view-all-link:hover {
      text-decoration: underline;
    }

    /* Activity List */
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem;
      border-radius: 12px;
      transition: background 0.2s ease;
    }

    .activity-item:hover {
      background: var(--background);
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .activity-icon svg {
      width: 20px;
      height: 20px;
    }

    .activity-icon.sale {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .activity-icon.email {
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
    }

    .activity-icon.report {
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
    }

    .activity-icon.alert {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .activity-content {
      flex: 1;
      min-width: 0;
    }

    .activity-title {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .activity-description {
      display: block;
      font-size: 0.8125rem;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .activity-meta {
      text-align: right;
      flex-shrink: 0;
    }

    .activity-time {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .activity-amount {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--success);
    }

    /* Quick Actions */
    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .quick-action {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem;
      background: var(--background);
      border: 1px solid var(--border-light);
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .quick-action:hover {
      background: var(--primary-light);
      border-color: var(--primary);
      transform: translateY(-2px);
    }

    .action-icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }

    .action-icon svg {
      width: 22px;
      height: 22px;
    }

    .action-icon.blue {
      background: rgba(59, 130, 246, 0.15);
      color: var(--accent-blue);
    }

    .action-icon.purple {
      background: rgba(139, 92, 246, 0.15);
      color: var(--accent-purple);
    }

    .action-icon.teal {
      background: rgba(20, 184, 166, 0.15);
      color: var(--accent-teal);
    }

    .action-icon.orange {
      background: rgba(245, 158, 11, 0.15);
      color: var(--warning);
    }

    .action-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    /* Insights */
    .insights-section {
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-light);
    }

    .insights-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.75rem 0;
    }

    .insight-card {
      padding: 0.875rem;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
      border: 1px solid rgba(139, 92, 246, 0.15);
      border-radius: 10px;
      margin-bottom: 0.5rem;
    }

    .insight-text {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.5;
    }

    .insight-text strong {
      color: var(--text-primary);
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

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    .modal-content {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      width: 100%;
      max-width: 480px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: modalSlideIn 0.3s ease;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 32px;
      height: 32px;
      border: none;
      background: var(--background-subtle);
      border-radius: 8px;
      font-size: 1.25rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      transition: all 0.2s;
    }

    .modal-close:hover {
      background: var(--border-light);
      color: var(--text-primary);
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
    }

    .modal-subtitle {
      font-size: 0.9375rem;
      color: var(--text-muted);
      margin: 0 0 1.5rem 0;
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: -0.5rem;
    }

    .form-input {
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-light);
      border-radius: 10px;
      font-size: 0.9375rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(28, 46, 74, 0.1);
    }

    .checkbox-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
      cursor: pointer;
    }

    .checkbox-group input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: rgb(28, 46, 74);
    }

    .modal-btn {
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 10px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 0.5rem;
    }

    .modal-btn.primary {
      background: linear-gradient(135deg, rgb(28, 46, 74) 0%, rgb(45, 75, 120) 100%);
      color: white;
    }

    .modal-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(28, 46, 74, 0.3);
    }
  `]
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('platformChart') platformChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('formatChart') formatChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('attributionChart') attributionChartRef!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];
  private revenueChartInstance: Chart | null = null;
  chartPeriod = 'monthly';

  // Modal state
  activeModal: string | null = null;

  stats: StatCard[] = [
    {
      label: 'Total Revenue',
      value: '$24,847',
      change: '+12.5%',
      changeType: 'up',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      gradient: true
    },
    {
      label: 'Books Sold',
      value: '3,247',
      change: '+8.2%',
      changeType: 'up',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
    },
    {
      label: 'Page Reads (KU)',
      value: '847K',
      change: '+15.3%',
      changeType: 'up',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'
    },
    {
      label: 'Active Campaigns',
      value: '12',
      change: '-2',
      changeType: 'neutral',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
    }
  ];

  platforms = [
    { name: 'Amazon KU', percentage: 45, color: '#3b82f6' },
    { name: 'Amazon Wide', percentage: 28, color: '#8b5cf6' },
    { name: 'Kobo', percentage: 12, color: '#14b8a6' },
    { name: 'Apple Books', percentage: 10, color: '#f59e0b' },
    { name: 'Other', percentage: 5, color: '#64748b' }
  ];

  topBooks = [
    { title: 'The Midnight Library', author: 'Pen Name A', revenue: '$4,250', sales: 892 },
    { title: 'Where the Crawdads Sing', author: 'Pen Name B', revenue: '$3,180', sales: 654 },
    { title: 'Atomic Habits', author: 'Pen Name A', revenue: '$2,940', sales: 612 },
    { title: 'The Invisible Life', author: 'Pen Name C', revenue: '$2,100', sales: 445 },
    { title: 'Project Hail Mary', author: 'Pen Name B', revenue: '$1,890', sales: 389 }
  ];

  recentActivity: RecentActivity[] = [
    { type: 'sale', title: 'New Sale', description: 'The Midnight Library sold on Amazon', time: '2 min ago', amount: '+$4.99' },
    { type: 'email', title: 'Campaign Sent', description: 'Newsletter blast to 12,847 subscribers', time: '1 hour ago' },
    { type: 'report', title: 'Report Generated', description: 'Q4 Royalties Summary is ready', time: '3 hours ago' },
    { type: 'alert', title: 'Price Alert', description: 'Competitor price drop detected', time: '5 hours ago' },
    { type: 'sale', title: 'Bulk Sale', description: '15 copies sold via BookBub promo', time: '8 hours ago', amount: '+$42.75' }
  ];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }

  private initCharts(): void {
    this.createRevenueChart();
    this.createPlatformChart();
    this.createFormatChart();
    this.createAttributionChart();
  }

  private createRevenueChart(): void {
    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Revenue',
          data: [1200, 1900, 1700, 2100, 2400, 2200, 2800, 3100, 2900, 3400, 3200, 3800],
          borderColor: '#3b82f6',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#3b82f6',
          pointHoverBorderColor: 'white',
          pointHoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: 'white',
            bodyColor: 'white',
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (ctx) => ctx.parsed.y != null ? `$${(ctx.parsed.y as number).toLocaleString()}` : ''
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { size: 12 } }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              color: '#64748b',
              font: { size: 12 },
              callback: (value) => '$' + (Number(value) / 1000) + 'K'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
    this.revenueChartInstance = chart;
    this.charts.push(chart);
  }

  private createPlatformChart(): void {
    const ctx = this.platformChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.platforms.map(p => p.name),
        datasets: [{
          data: this.platforms.map(p => p.percentage),
          backgroundColor: this.platforms.map(p => p.color),
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed}%`
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createFormatChart(): void {
    const ctx = this.formatChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Ebook', 'Paperback', 'Hardcover', 'Audiobook'],
        datasets: [{
          label: 'Sales',
          data: [2450, 890, 320, 587],
          backgroundColor: [
            'rgba(59, 130, 246, 0.85)',
            'rgba(139, 92, 246, 0.85)',
            'rgba(20, 184, 166, 0.85)',
            'rgba(245, 158, 11, 0.85)'
          ],
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { size: 12 } }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { color: '#64748b', font: { size: 12 } }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createAttributionChart(): void {
    const ctx = this.attributionChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Email', 'Social', 'Organic', 'Paid Ads', 'Direct'],
        datasets: [{
          label: 'Attribution %',
          data: [35, 25, 20, 12, 8],
          backgroundColor: [
            'rgba(139, 92, 246, 0.85)',
            'rgba(59, 130, 246, 0.85)',
            'rgba(16, 185, 129, 0.85)',
            'rgba(245, 158, 11, 0.85)',
            'rgba(100, 116, 139, 0.85)'
          ],
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => `${ctx.parsed.x}%`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              callback: (value) => value + '%'
            },
            max: 40
          },
          y: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { size: 12 } }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  switchChartPeriod(period: string): void {
    this.chartPeriod = period;
    if (this.revenueChartInstance) {
      const weeklyData = [320, 420, 380, 510, 470, 620, 580, 710, 650, 780, 720, 850];
      const monthlyData = [1200, 1900, 1700, 2100, 2400, 2200, 2800, 3100, 2900, 3400, 3200, 3800];
      const weeklyLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];
      const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      this.revenueChartInstance.data.labels = period === 'weekly' ? weeklyLabels : monthlyLabels;
      this.revenueChartInstance.data.datasets[0].data = period === 'weekly' ? weeklyData : monthlyData;
      this.revenueChartInstance.update();
    }
  }

  openModal(modalType: string): void {
    this.activeModal = modalType;
  }

  closeModal(): void {
    this.activeModal = null;
  }
}
