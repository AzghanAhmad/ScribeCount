import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Campaign {
  id: string;
  name: string;
  status: 'sent' | 'scheduled' | 'draft';
  sentDate?: string;
  scheduledDate?: string;
  recipients: number;
  openRate: number;
  clickRate: number;
  revenue: number;
  type: 'newsletter' | 'promo' | 'launch' | 'automated';
}

interface EmailMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

@Component({
  selector: 'app-email-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">Email Campaigns</h1>
          <p class="page-subtitle">Manage your email marketing and track performance</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="openImportModal()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import List
          </button>
          <button class="btn btn-primary" (click)="openNewCampaignModal()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Campaign
          </button>
        </div>
      </div>

      <!-- Email Metrics -->
      <div class="metrics-grid animate-fade-in-up">
        <div *ngFor="let metric of emailMetrics; let i = index" 
             class="metric-card"
             [style.animationDelay]="(i * 0.1) + 's'">
          <div class="metric-icon" [class]="getMetricIconClass(i)" [innerHTML]="metric.icon"></div>
          <div class="metric-content">
            <span class="metric-value">{{ metric.value }}</span>
            <span class="metric-label">{{ metric.label }}</span>
          </div>
          <div class="metric-change" [class]="metric.trend">
            {{ metric.change }}
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Left Column - Campaign Performance Chart -->
        <div class="chart-card animate-fade-in-up" style="animation-delay: 0.2s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Campaign Performance</h3>
              <p class="chart-subtitle">Open and click rates over time</p>
            </div>
            <div class="chart-period">
              <button class="period-btn" [class.active]="period === 'week'" (click)="changePeriod('week')">Week</button>
              <button class="period-btn" [class.active]="period === 'month'" (click)="changePeriod('month')">Month</button>
              <button class="period-btn" [class.active]="period === 'year'" (click)="changePeriod('year')">Year</button>
            </div>
          </div>
          <div class="chart-container">
            <canvas #performanceChart></canvas>
          </div>
        </div>

        <!-- Right Column - Subscriber Growth -->
        <div class="chart-card animate-fade-in-up" style="animation-delay: 0.3s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Subscriber Growth</h3>
              <p class="chart-subtitle">List growth over the past 6 months</p>
            </div>
          </div>
          <div class="chart-container">
            <canvas #growthChart></canvas>
          </div>
          <div class="growth-stats">
            <div class="growth-stat">
              <span class="growth-label">Total Subscribers</span>
              <span class="growth-value">24,847</span>
            </div>
            <div class="growth-stat">
              <span class="growth-label">New This Month</span>
              <span class="growth-value success">+1,234</span>
            </div>
            <div class="growth-stat">
              <span class="growth-label">Unsubscribed</span>
              <span class="growth-value error">-89</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Campaigns Table -->
      <div class="table-card animate-fade-in-up" style="animation-delay: 0.4s">
        <div class="table-header">
          <div class="table-title-group">
            <h3 class="table-title">Recent Campaigns</h3>
            <p class="table-subtitle">Your email campaigns and their performance</p>
          </div>
          <div class="table-filters">
            <select class="filter-select" [(ngModel)]="statusFilter">
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>
            <select class="filter-select" [(ngModel)]="typeFilter">
              <option value="all">All Types</option>
              <option value="newsletter">Newsletter</option>
              <option value="promo">Promotion</option>
              <option value="launch">Book Launch</option>
              <option value="automated">Automated</option>
            </select>
          </div>
        </div>

        <div class="campaigns-table">
          <div class="table-row table-head">
            <div class="table-cell">Campaign</div>
            <div class="table-cell center">Status</div>
            <div class="table-cell center">Recipients</div>
            <div class="table-cell center">Open Rate</div>
            <div class="table-cell center">Click Rate</div>
            <div class="table-cell right">Revenue</div>
            <div class="table-cell center">Actions</div>
          </div>

          <div *ngFor="let campaign of filteredCampaigns; let i = index" 
               class="table-row"
               [style.animationDelay]="(0.5 + i * 0.05) + 's'">
            <div class="table-cell campaign-info">
              <div class="campaign-icon" [class]="campaign.type">
                <svg *ngIf="campaign.type === 'newsletter'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <svg *ngIf="campaign.type === 'promo'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <svg *ngIf="campaign.type === 'launch'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <svg *ngIf="campaign.type === 'automated'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div class="campaign-details">
                <span class="campaign-name">{{ campaign.name }}</span>
                <span class="campaign-date">{{ campaign.sentDate || campaign.scheduledDate || 'Not scheduled' }}</span>
              </div>
            </div>
            <div class="table-cell center">
              <span class="status-badge" [class]="campaign.status">
                {{ campaign.status | titlecase }}
              </span>
            </div>
            <div class="table-cell center">{{ campaign.recipients | number }}</div>
            <div class="table-cell center">
              <div class="rate-cell">
                <span class="rate-value">{{ campaign.openRate }}%</span>
                <div class="rate-bar">
                  <div class="rate-fill" [style.width]="campaign.openRate + '%'" [class.good]="campaign.openRate > 30"></div>
                </div>
              </div>
            </div>
            <div class="table-cell center">
              <div class="rate-cell">
                <span class="rate-value">{{ campaign.clickRate }}%</span>
                <div class="rate-bar">
                  <div class="rate-fill click" [style.width]="campaign.clickRate * 5 + '%'" [class.good]="campaign.clickRate > 5"></div>
                </div>
              </div>
            </div>
            <div class="table-cell right revenue">
              {{ campaign.revenue | currency:'USD':'symbol':'1.0-0' }}
            </div>
            <div class="table-cell center actions">
              <button class="action-btn" title="View" (click)="viewCampaign(campaign)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <button class="action-btn" title="Duplicate" (click)="duplicateCampaign(campaign)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
              <button class="action-btn" title="Delete" (click)="deleteCampaign(campaign)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section - Automation & Tips -->
      <div class="bottom-grid">
        <!-- Automation Flows -->
        <div class="chart-card animate-fade-in-up" style="animation-delay: 0.6s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Active Automations</h3>
              <p class="chart-subtitle">Your automated email sequences</p>
            </div>
            <button class="btn btn-secondary btn-sm" (click)="openNewFlowModal()">+ New Flow</button>
          </div>
          <div class="automations-list">
            <div *ngFor="let auto of automations" class="automation-item">
              <div class="automation-status" [class.active]="auto.active"></div>
              <div class="automation-info">
                <span class="automation-name">{{ auto.name }}</span>
                <span class="automation-trigger">Trigger: {{ auto.trigger }}</span>
              </div>
              <div class="automation-stats">
                <span class="automation-sent">{{ auto.sent | number }} sent</span>
                <span class="automation-rate">{{ auto.openRate }}% opens</span>
              </div>
              <button class="action-btn" (click)="editAutomation(auto)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Deliverability Score -->
        <div class="chart-card animate-fade-in-up" style="animation-delay: 0.7s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Deliverability Score</h3>
              <p class="chart-subtitle">Email health metrics</p>
            </div>
          </div>
          <div class="deliverability-container">
            <div class="score-ring">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" stroke-width="10"/>
                <circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGradient)" stroke-width="10" 
                        stroke-linecap="round" stroke-dasharray="327" stroke-dashoffset="49" 
                        transform="rotate(-90 60 60)"/>
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#10b981"/>
                    <stop offset="100%" stop-color="#14b8a6"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="score-value">
                <span class="score-number">85</span>
                <span class="score-label">Excellent</span>
              </div>
            </div>
            <div class="health-metrics">
              <div class="health-item">
                <div class="health-label">
                  <span class="health-dot success"></span>
                  Delivery Rate
                </div>
                <span class="health-value">98.5%</span>
              </div>
              <div class="health-item">
                <div class="health-label">
                  <span class="health-dot warning"></span>
                  Bounce Rate
                </div>
                <span class="health-value">1.2%</span>
              </div>
              <div class="health-item">
                <div class="health-label">
                  <span class="health-dot success"></span>
                  Spam Score
                </div>
                <span class="health-value">Low</span>
              </div>
              <div class="health-item">
                <div class="health-label">
                  <span class="health-dot success"></span>
                  Domain Auth
                </div>
                <span class="health-value">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- New Campaign Modal -->
      <div class="modal-overlay" *ngIf="showNewCampaignModal" (click)="closeModals()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="closeModals()">×</button>
          <div class="modal-body">
            <div class="modal-header-section">
              <div class="modal-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h2 class="modal-title">Create New Campaign</h2>
              <p class="modal-subtitle">Set up your email campaign details</p>
            </div>
            
            <div class="modal-form">
              <label class="form-label">Campaign Name</label>
              <input type="text" class="form-input" placeholder="e.g., February Newsletter" [(ngModel)]="newCampaignName">
              
              <label class="form-label">Campaign Type</label>
              <div class="type-selector">
                <button class="type-btn" [class.active]="newCampaignType === 'newsletter'" (click)="newCampaignType = 'newsletter'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Newsletter
                </button>
                <button class="type-btn" [class.active]="newCampaignType === 'promo'" (click)="newCampaignType = 'promo'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Promotion
                </button>
                <button class="type-btn" [class.active]="newCampaignType === 'launch'" (click)="newCampaignType = 'launch'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  Book Launch
                </button>
              </div>
              
              <label class="form-label">Subject Line</label>
              <input type="text" class="form-input" placeholder="Enter your email subject" [(ngModel)]="newCampaignSubject">
              
              <label class="form-label">Recipients</label>
              <select class="form-input" [(ngModel)]="newCampaignRecipients">
                <option value="all">All Subscribers (24,847)</option>
                <option value="engaged">Engaged Readers (18,234)</option>
                <option value="new">New Subscribers (1,234)</option>
                <option value="buyers">Previous Buyers (8,456)</option>
              </select>
              
              <label class="form-label">Schedule</label>
              <div class="schedule-options">
                <label class="radio-option">
                  <input type="radio" name="schedule" value="now" [(ngModel)]="campaignSchedule">
                  <span>Send Immediately</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="schedule" value="later" [(ngModel)]="campaignSchedule">
                  <span>Schedule for Later</span>
                </label>
              </div>
              
              <div class="modal-actions">
                <button class="modal-btn secondary" (click)="closeModals()">Cancel</button>
                <button class="modal-btn primary" (click)="createCampaign()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- New Flow Modal -->
      <div class="modal-overlay" *ngIf="showNewFlowModal" (click)="closeModals()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="closeModals()">×</button>
          <div class="modal-body">
            <div class="modal-header-section">
              <div class="modal-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h2 class="modal-title">Create Automation Flow</h2>
              <p class="modal-subtitle">Set up an automated email sequence</p>
            </div>
            
            <div class="modal-form">
              <label class="form-label">Flow Name</label>
              <input type="text" class="form-input" placeholder="e.g., Welcome Series" [(ngModel)]="newFlowName">
              
              <label class="form-label">Trigger Event</label>
              <div class="type-selector">
                <button class="type-btn" [class.active]="newFlowTrigger === 'subscribe'" (click)="newFlowTrigger = 'subscribe'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  New Subscriber
                </button>
                <button class="type-btn" [class.active]="newFlowTrigger === 'purchase'" (click)="newFlowTrigger = 'purchase'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Purchase
                </button>
                <button class="type-btn" [class.active]="newFlowTrigger === 'abandoned'" (click)="newFlowTrigger = 'abandoned'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Abandoned Cart
                </button>
              </div>
              
              <label class="form-label">Number of Emails in Sequence</label>
              <select class="form-input" [(ngModel)]="newFlowEmails">
                <option value="1">1 Email</option>
                <option value="3">3 Emails</option>
                <option value="5">5 Emails</option>
                <option value="7">7 Emails</option>
              </select>
              
              <label class="form-label">Delay Between Emails</label>
              <select class="form-input" [(ngModel)]="newFlowDelay">
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="7">1 Week</option>
              </select>
              
              <div class="modal-actions">
                <button class="modal-btn secondary" (click)="closeModals()">Cancel</button>
                <button class="modal-btn primary" (click)="createFlow()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  Create Flow
                </button>
              </div>
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
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
    }

    .btn-secondary {
      background: white;
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 1024px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .metric-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 14px;
      transition: all 0.3s ease;
    }

    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
      border-radius: 12px;
      color: var(--accent-indigo);
    }

    .metric-icon.purple {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.2) 100%);
      color: #8b5cf6;
    }

    .metric-icon.blue {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.2) 100%);
      color: #3b82f6;
    }

    .metric-icon.teal {
      background: linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(13, 148, 136, 0.2) 100%);
      color: #14b8a6;
    }

    .metric-icon.green {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.2) 100%);
      color: #10b981;
    }

    .metric-icon svg,
    .metric-icon :global(svg) {
      width: 24px;
      height: 24px;
    }

    .metric-content {
      flex: 1;
    }

    .metric-value {
      display: block;
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .metric-label {
      display: block;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .metric-change {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
    }

    .metric-change.up {
      background: rgba(16, 185, 129, 0.1);
      color: var(--trend-up);
    }

    .metric-change.down {
      background: rgba(239, 68, 68, 0.1);
      color: var(--trend-down);
    }

    .metric-change.neutral {
      background: var(--background-subtle);
      color: var(--text-muted);
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    .chart-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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

    .chart-period {
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

    .period-btn:hover {
      color: var(--text-primary);
    }

    .period-btn.active {
      background: white;
      color: var(--text-primary);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .chart-container {
      height: 260px;
      position: relative;
    }

    .growth-stats {
      display: flex;
      justify-content: space-around;
      padding-top: 1.25rem;
      margin-top: 1.25rem;
      border-top: 1px solid var(--border-light);
    }

    .growth-stat {
      text-align: center;
    }

    .growth-label {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }

    .growth-value {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .growth-value.success { color: var(--trend-up); }
    .growth-value.error { color: var(--trend-down); }

    /* Table Card */
    .table-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .table-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .table-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .table-subtitle {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin: 0;
    }

    .table-filters {
      display: flex;
      gap: 0.75rem;
    }

    .filter-select {
      padding: 0.5rem 2rem 0.5rem 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 0.8125rem;
      background: white;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.5rem center;
    }

    .campaigns-table {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.25fr 1.25fr 1fr 100px;
      gap: 1rem;
      padding: 1rem;
      align-items: center;
      border-radius: 10px;
      transition: background 0.2s;
    }

    .table-head {
      background: var(--background-subtle);
    }

    .table-head .table-cell {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    .table-row:not(.table-head):hover {
      background: var(--background);
    }

    .table-cell {
      font-size: 0.875rem;
      color: var(--text-primary);
    }

    .table-cell.center { text-align: center; }
    .table-cell.right { text-align: right; }

    .campaign-info {
      display: flex;
      align-items: center;
      gap: 0.875rem;
    }

    .campaign-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
    }

    .campaign-icon svg {
      width: 20px;
      height: 20px;
    }

    .campaign-icon.newsletter {
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
    }

    .campaign-icon.promo {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .campaign-icon.launch {
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
    }

    .campaign-icon.automated {
      background: rgba(20, 184, 166, 0.1);
      color: var(--accent-teal);
    }

    .campaign-details {
      display: flex;
      flex-direction: column;
    }

    .campaign-name {
      font-weight: 500;
      color: var(--text-primary);
    }

    .campaign-date {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.625rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 100px;
    }

    .status-badge.sent {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .status-badge.scheduled {
      background: rgba(59, 130, 246, 0.1);
      color: var(--info);
    }

    .status-badge.draft {
      background: var(--background-subtle);
      color: var(--text-muted);
    }

    .rate-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .rate-value {
      font-weight: 500;
    }

    .rate-bar {
      width: 100%;
      height: 4px;
      background: var(--background-subtle);
      border-radius: 2px;
      overflow: hidden;
    }

    .rate-fill {
      height: 100%;
      background: #94a3b8;
      border-radius: 2px;
      transition: width 0.5s ease;
    }

    .rate-fill.good {
      background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
    }

    .rate-fill.click {
      background: #8b5cf6;
    }

    .rate-fill.click.good {
      background: linear-gradient(90deg, #8b5cf6 0%, #10b981 100%);
    }

    .revenue {
      font-weight: 600;
      color: var(--success);
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 0.25rem;
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
      background: var(--primary-light);
      color: var(--primary);
    }

    .action-btn svg {
      width: 16px;
      height: 16px;
    }

    /* Bottom Grid */
    .bottom-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 1024px) {
      .bottom-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Automations List */
    .automations-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .automation-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--background);
      border-radius: 12px;
      transition: all 0.2s;
    }

    .automation-item:hover {
      background: var(--primary-light);
    }

    .automation-status {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--text-muted);
    }

    .automation-status.active {
      background: var(--success);
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    }

    .automation-info {
      flex: 1;
    }

    .automation-name {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .automation-trigger {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .automation-stats {
      text-align: right;
    }

    .automation-sent {
      display: block;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .automation-rate {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* Deliverability */
    .deliverability-container {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .score-ring {
      position: relative;
      width: 120px;
      height: 120px;
      flex-shrink: 0;
    }

    .score-ring svg {
      width: 100%;
      height: 100%;
    }

    .score-value {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .score-number {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .score-label {
      font-size: 0.75rem;
      color: var(--success);
      font-weight: 500;
    }

    .health-metrics {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .health-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .health-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .health-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .health-dot.success { background: var(--success); }
    .health-dot.warning { background: var(--warning); }
    .health-dot.error { background: var(--error); }

    .health-value {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
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

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    .modal-content {
      background: white;
      border-radius: 20px;
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--text-muted);
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .modal-close:hover {
      background: var(--background);
      color: var(--text-primary);
    }

    .modal-body {
      padding: 2rem;
    }

    .modal-header-section {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .modal-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-icon.blue {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.2) 100%);
      color: #3b82f6;
    }

    .modal-icon.purple {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.2) 100%);
      color: #8b5cf6;
    }

    .modal-icon svg {
      width: 32px;
      height: 32px;
    }

    .modal-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .modal-subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: -0.5rem;
    }

    .form-input {
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--accent-indigo);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    }

    .type-selector {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .type-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--background);
      border: 2px solid var(--border-light);
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .type-btn svg {
      width: 24px;
      height: 24px;
    }

    .type-btn:hover {
      border-color: var(--accent-indigo);
      background: rgba(139, 92, 246, 0.05);
    }

    .type-btn.active {
      border-color: var(--accent-indigo);
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-indigo);
    }

    .schedule-options {
      display: flex;
      gap: 1.5rem;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .radio-option input[type="radio"] {
      accent-color: var(--accent-indigo);
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-light);
    }

    .modal-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .modal-btn .btn-icon {
      width: 16px;
      height: 16px;
    }

    .modal-btn.secondary {
      background: var(--background);
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
    }

    .modal-btn.secondary:hover {
      background: var(--border-light);
    }

    .modal-btn.primary {
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }

    .modal-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
    }
  `]
})
export class EmailCampaignsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('performanceChart') performanceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('growthChart') growthChartRef!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];
  period = 'month';
  statusFilter = 'all';
  typeFilter = 'all';

  // Modal state
  showNewCampaignModal = false;
  showNewFlowModal = false;

  // New Campaign form
  newCampaignName = '';
  newCampaignType: 'newsletter' | 'promo' | 'launch' = 'newsletter';
  newCampaignSubject = '';
  newCampaignRecipients = 'all';
  campaignSchedule = 'now';

  // New Flow form
  newFlowName = '';
  newFlowTrigger = 'subscribe';
  newFlowEmails = '3';
  newFlowDelay = '2';

  emailMetrics: EmailMetric[] = [
    {
      label: 'Total Subscribers',
      value: '24,847',
      change: '+12.4%',
      trend: 'up',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    },
    {
      label: 'Avg Open Rate',
      value: '42.8%',
      change: '+3.2%',
      trend: 'up',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
    },
    {
      label: 'Avg Click Rate',
      value: '8.4%',
      change: '-0.8%',
      trend: 'down',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'
    },
    {
      label: 'Revenue Generated',
      value: '$12,450',
      change: '+24.7%',
      trend: 'up',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
    }
  ];

  campaigns: Campaign[] = [
    { id: '1', name: 'January Newsletter', status: 'sent', sentDate: 'Jan 28, 2025', recipients: 24500, openRate: 45.2, clickRate: 8.7, revenue: 2450, type: 'newsletter' },
    { id: '2', name: 'New Release: The Midnight Library', status: 'sent', sentDate: 'Jan 25, 2025', recipients: 24200, openRate: 52.8, clickRate: 12.4, revenue: 4820, type: 'launch' },
    { id: '3', name: 'Weekend Sale - 50% Off', status: 'sent', sentDate: 'Jan 20, 2025', recipients: 23800, openRate: 38.5, clickRate: 9.2, revenue: 3150, type: 'promo' },
    { id: '4', name: 'February Preview', status: 'scheduled', scheduledDate: 'Feb 5, 2025', recipients: 24847, openRate: 0, clickRate: 0, revenue: 0, type: 'newsletter' },
    { id: '5', name: 'Valentine\'s Special', status: 'draft', recipients: 0, openRate: 0, clickRate: 0, revenue: 0, type: 'promo' }
  ];

  automations: { name: string; trigger: string; sent: number; openRate: number; active: boolean }[] = [
    { name: 'Welcome Sequence', trigger: 'New subscriber', sent: 12450, openRate: 58.4, active: true },
    { name: 'Abandoned Cart', trigger: 'Cart left for 1 hour', sent: 3240, openRate: 42.1, active: true },
    { name: 'Re-engagement', trigger: 'Inactive for 30 days', sent: 890, openRate: 28.7, active: true },
    { name: 'Post-Purchase', trigger: 'Order confirmed', sent: 5680, openRate: 72.3, active: false }
  ];

  get filteredCampaigns(): Campaign[] {
    return this.campaigns.filter(c => {
      const statusMatch = this.statusFilter === 'all' || c.status === this.statusFilter;
      const typeMatch = this.typeFilter === 'all' || c.type === this.typeFilter;
      return statusMatch && typeMatch;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }

  private initCharts(): void {
    this.createPerformanceChart();
    this.createGrowthChart();
  }

  private createPerformanceChart(): void {
    const ctx = this.performanceChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Open Rate',
            data: [42, 45, 41, 48],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Click Rate',
            data: [8.2, 9.1, 7.8, 8.9],
            borderColor: '#8b5cf6',
            backgroundColor: 'transparent',
            borderWidth: 3,
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b' }
          },
          y: {
            type: 'linear',
            position: 'left',
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              color: '#64748b',
              callback: (value) => value + '%'
            },
            max: 60
          },
          y1: {
            type: 'linear',
            position: 'right',
            grid: { display: false },
            ticks: {
              color: '#64748b',
              callback: (value) => value + '%'
            },
            max: 15
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createGrowthChart(): void {
    const ctx = this.growthChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
          label: 'Subscribers',
          data: [18500, 19800, 20900, 22100, 23600, 24847],
          backgroundColor: gradient,
          borderColor: '#8b5cf6',
          borderWidth: 2,
          borderRadius: 6,
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
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ctx.parsed.y != null ? `${(ctx.parsed.y as number).toLocaleString()} subscribers` : ''
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b' }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              color: '#64748b',
              callback: (value) => (Number(value) / 1000) + 'K'
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  // Button Handlers
  openImportModal(): void {
    console.log('Opening import list modal...');
    // In a real app, this would open a modal
    alert('Import List: Upload a CSV or connect to your email service provider');
  }

  openNewCampaignModal(): void {
    this.showNewCampaignModal = true;
    this.newCampaignName = '';
    this.newCampaignType = 'newsletter';
    this.newCampaignSubject = '';
    this.newCampaignRecipients = 'all';
    this.campaignSchedule = 'now';
  }

  openNewFlowModal(): void {
    this.showNewFlowModal = true;
    this.newFlowName = '';
    this.newFlowTrigger = 'subscribe';
    this.newFlowEmails = '3';
    this.newFlowDelay = '2';
  }

  closeModals(): void {
    this.showNewCampaignModal = false;
    this.showNewFlowModal = false;
  }

  createCampaign(): void {
    if (!this.newCampaignName.trim()) {
      alert('Please enter a campaign name');
      return;
    }

    const recipientCounts: Record<string, number> = {
      'all': 24847,
      'engaged': 18234,
      'new': 1234,
      'buyers': 8456
    };

    const newCampaign: Campaign = {
      id: (this.campaigns.length + 1).toString(),
      name: this.newCampaignName,
      type: this.newCampaignType,
      status: this.campaignSchedule === 'now' ? 'draft' : 'scheduled',
      scheduledDate: this.campaignSchedule === 'later' ? 'Feb 10, 2025' : undefined,
      recipients: recipientCounts[this.newCampaignRecipients],
      openRate: 0,
      clickRate: 0,
      revenue: 0
    };

    this.campaigns.unshift(newCampaign);
    this.closeModals();
    console.log('Created campaign:', newCampaign);
  }

  createFlow(): void {
    if (!this.newFlowName.trim()) {
      alert('Please enter a flow name');
      return;
    }

    const triggerLabels: Record<string, string> = {
      'subscribe': 'New Subscriber',
      'purchase': 'Purchase Complete',
      'abandoned': 'Cart Abandoned'
    };

    const newAutomation = {
      id: (this.automations.length + 1).toString(),
      name: this.newFlowName,
      trigger: triggerLabels[this.newFlowTrigger],
      sent: 0,
      openRate: 0,
      active: false
    };

    this.automations.unshift(newAutomation);
    this.closeModals();
    console.log('Created automation:', newAutomation);
  }

  // Period Filter
  changePeriod(newPeriod: string): void {
    this.period = newPeriod;
    this.updatePerformanceChart();
  }

  private updatePerformanceChart(): void {
    const chart = this.charts[0]; // Performance chart is first
    if (!chart) return;

    let labels: string[];
    let openRates: number[];
    let clickRates: number[];

    switch (this.period) {
      case 'week':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        openRates = [42, 45, 38, 41, 48, 35, 39];
        clickRates = [8, 9, 7, 8, 10, 6, 7];
        break;
      case 'year':
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        openRates = [40, 42, 38, 44, 46, 43, 41, 45, 47, 44, 48, 46];
        clickRates = [7, 8, 7, 9, 9, 8, 8, 9, 10, 9, 10, 9];
        break;
      default: // month
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        openRates = [42, 45, 38, 48];
        clickRates = [8, 9, 7, 10];
    }

    chart.data.labels = labels;
    chart.data.datasets[0].data = openRates;
    chart.data.datasets[1].data = clickRates;
    chart.update();
  }

  // Campaign Actions
  viewCampaign(campaign: Campaign): void {
    console.log('Viewing campaign:', campaign.name);
    alert(`Campaign Details:\n\nName: ${campaign.name}\nStatus: ${campaign.status}\nRecipients: ${campaign.recipients.toLocaleString()}\nOpen Rate: ${campaign.openRate}%\nClick Rate: ${campaign.clickRate}%\nRevenue: $${campaign.revenue}`);
  }

  duplicateCampaign(campaign: Campaign): void {
    const newCampaign: Campaign = {
      ...campaign,
      id: (this.campaigns.length + 1).toString(),
      name: campaign.name + ' (Copy)',
      status: 'draft',
      sentDate: undefined,
      scheduledDate: undefined,
      openRate: 0,
      clickRate: 0,
      revenue: 0
    };
    this.campaigns.unshift(newCampaign);
    console.log('Duplicated campaign:', campaign.name);
  }

  deleteCampaign(campaign: Campaign): void {
    if (confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
      this.campaigns = this.campaigns.filter(c => c.id !== campaign.id);
      console.log('Deleted campaign:', campaign.name);
    }
  }

  // Automation Actions
  editAutomation(automation: any): void {
    console.log('Editing automation:', automation.name);
    alert(`Edit Automation:\n\nName: ${automation.name}\nTrigger: ${automation.trigger}\nActive: ${automation.active ? 'Yes' : 'No'}\nEmails Sent: ${automation.sent.toLocaleString()}\nOpen Rate: ${automation.openRate}%`);
  }

  // Helper for metric icon colors
  getMetricIconClass(index: number): string {
    const classes = ['purple', 'blue', 'teal', 'green'];
    return classes[index] || 'purple';
  }
}
