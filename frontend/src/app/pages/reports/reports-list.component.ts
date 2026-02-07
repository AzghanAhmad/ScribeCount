import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Report {
  id: string;
  name: string;
  type: 'royalties' | 'analytics' | 'attribution' | 'email' | 'custom';
  description: string;
  lastRun: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  status: 'ready' | 'generating' | 'scheduled';
  size?: string;
}

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">Reports</h1>
          <p class="page-subtitle">Generate, schedule, and download your business reports</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="openScheduleModal()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Schedule Report
          </button>
          <button class="btn btn-primary" (click)="showNewReportModal = true">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Report
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats animate-fade-in-up">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ reports.length }}</span>
            <span class="stat-label">Total Reports</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ scheduledCount }}</span>
            <span class="stat-label">Scheduled</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ recentCount }}</span>
            <span class="stat-label">Generated This Week</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" class="search-input" placeholder="Search reports..." [(ngModel)]="searchQuery">
        </div>
        <div class="filter-group">
          <select class="filter-select" [(ngModel)]="typeFilter">
            <option value="all">All Types</option>
            <option value="royalties">Royalties</option>
            <option value="analytics">Analytics</option>
            <option value="attribution">Attribution</option>
            <option value="email">Email</option>
            <option value="custom">Custom</option>
          </select>
          <select class="filter-select" [(ngModel)]="statusFilter">
            <option value="all">All Status</option>
            <option value="ready">Ready</option>
            <option value="generating">Generating</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
        <div class="view-toggle">
          <button class="toggle-btn" [class.active]="viewMode === 'grid'" (click)="viewMode = 'grid'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
          <button class="toggle-btn" [class.active]="viewMode === 'list'" (click)="viewMode = 'list'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Grid View -->
      <div *ngIf="viewMode === 'grid'" class="reports-grid">
        <div *ngFor="let report of filteredReports; let i = index" 
             class="report-card animate-fade-in-up"
             [style.animationDelay]="(0.15 + i * 0.05) + 's'">
          <div class="report-header">
            <div class="report-icon" [class]="report.type">
              <svg *ngIf="report.type === 'royalties'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <svg *ngIf="report.type === 'analytics'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              <svg *ngIf="report.type === 'attribution'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              <svg *ngIf="report.type === 'email'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <svg *ngIf="report.type === 'custom'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <span class="report-status" [class]="report.status">
              <span class="status-dot" *ngIf="report.status === 'generating'"></span>
              {{ getStatusLabel(report.status) }}
            </span>
          </div>
          <h3 class="report-name">{{ report.name }}</h3>
          <p class="report-description">{{ report.description }}</p>
          <div class="report-meta">
            <div class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ report.lastRun }}
            </div>
            <div class="meta-item" *ngIf="report.frequency !== 'once'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              {{ report.frequency | titlecase }}
            </div>
            <div class="meta-item" *ngIf="report.size">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              {{ report.size }}
            </div>
          </div>
          <div class="report-actions">
            <button class="action-btn" title="Download" (click)="downloadReport(report)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </button>
            <button class="action-btn" title="Re-run" (click)="rerunReport(report)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
            </button>
            <button class="action-btn" title="Share" (click)="shareReport(report)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
            <button class="action-btn" title="Delete" (click)="deleteReport(report)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- New Report Card -->
        <button class="report-card new-report-card" (click)="showNewReportModal = true">
          <div class="new-report-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <span class="new-report-text">Create New Report</span>
        </button>
      </div>

      <!-- List View -->
      <div *ngIf="viewMode === 'list'" class="reports-table animate-fade-in-up" style="animation-delay: 0.15s">
        <div class="table-row table-header">
          <div class="table-cell">Report Name</div>
          <div class="table-cell">Type</div>
          <div class="table-cell">Last Run</div>
          <div class="table-cell">Frequency</div>
          <div class="table-cell center">Status</div>
          <div class="table-cell right">Actions</div>
        </div>
        <div *ngFor="let report of filteredReports" class="table-row">
          <div class="table-cell report-name-cell">
            <div class="report-icon small" [class]="report.type">
              <svg *ngIf="report.type === 'royalties'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <svg *ngIf="report.type === 'analytics'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              <svg *ngIf="report.type === 'attribution'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
              </svg>
              <svg *ngIf="report.type === 'email'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <svg *ngIf="report.type === 'custom'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div class="report-info">
              <span class="report-title">{{ report.name }}</span>
              <span class="report-desc">{{ report.description }}</span>
            </div>
          </div>
          <div class="table-cell">
            <span class="type-badge" [class]="report.type">{{ report.type | titlecase }}</span>
          </div>
          <div class="table-cell">{{ report.lastRun }}</div>
          <div class="table-cell">{{ report.frequency | titlecase }}</div>
          <div class="table-cell center">
            <span class="status-badge" [class]="report.status">
              <span class="status-dot" *ngIf="report.status === 'generating'"></span>
              {{ getStatusLabel(report.status) }}
            </span>
          </div>
          <div class="table-cell right">
            <div class="table-actions">
              <button class="action-btn" title="Download">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
              <button class="action-btn" title="Re-run">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </button>
              <button class="action-btn" title="More">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="1"/>
                  <circle cx="19" cy="12" r="1"/>
                  <circle cx="5" cy="12" r="1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Templates Section -->
      <div class="templates-section animate-fade-in-up" style="animation-delay: 0.3s">
        <h2 class="templates-title">Report Templates</h2>
        <p class="templates-subtitle">Quick start with pre-built report templates</p>
        <div class="templates-grid">
          <button *ngFor="let template of templates" class="template-card" (click)="useTemplate(template)">
            <div class="template-icon" [style.background]="template.gradient">
              <svg [innerHTML]="template.icon"></svg>
            </div>
            <div class="template-info">
              <span class="template-name">{{ template.name }}</span>
              <span class="template-desc">{{ template.description }}</span>
            </div>
            <svg class="template-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Create Report Modal -->
      <div class="modal-overlay" *ngIf="showNewReportModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="closeModal()">×</button>
          
          <div class="modal-body">
            <h2 class="modal-title">{{ selectedTemplate ? 'Create ' + selectedTemplate.name : 'Create New Report' }}</h2>
            <p class="modal-subtitle">{{ selectedTemplate?.description || 'Generate a custom report for your book sales' }}</p>
            
            <div class="modal-form">
              <label class="form-label">Report Name</label>
              <input type="text" class="form-input" placeholder="Q1 Sales Report" [(ngModel)]="reportName">
              
              <label class="form-label">Date Range</label>
              <select class="form-input" [(ngModel)]="dateRange">
                <option value="last7">Last 7 days</option>
                <option value="last30">Last 30 days</option>
                <option value="last90">Last 90 days</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisYear">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
              
              <label class="form-label">Platforms</label>
              <div class="checkbox-group">
                <label><input type="checkbox" [checked]="selectedPlatforms.includes('amazon')" (change)="togglePlatform('amazon')"> Amazon</label>
                <label><input type="checkbox" [checked]="selectedPlatforms.includes('kobo')" (change)="togglePlatform('kobo')"> Kobo</label>
                <label><input type="checkbox" [checked]="selectedPlatforms.includes('apple')" (change)="togglePlatform('apple')"> Apple Books</label>
                <label><input type="checkbox" [checked]="selectedPlatforms.includes('other')" (change)="togglePlatform('other')"> Other</label>
              </div>
              
              <label class="form-label">Metrics to Include</label>
              <div class="checkbox-group">
                <label><input type="checkbox" [(ngModel)]="includeRevenue"> Revenue</label>
                <label><input type="checkbox" [(ngModel)]="includeSales"> Sales Count</label>
                <label><input type="checkbox" [(ngModel)]="includePageReads"> Page Reads</label>
                <label><input type="checkbox" [(ngModel)]="includeRoyalties"> Royalties</label>
              </div>
              
              <div class="modal-actions">
                <button class="modal-btn secondary" (click)="closeModal()">Cancel</button>
                <button class="modal-btn primary" (click)="generateReport()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule Report Modal -->
      <div class="modal-overlay" *ngIf="showScheduleModal" (click)="closeAllModals()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="closeAllModals()">×</button>
          <div class="modal-body">
            <h2 class="modal-title">Schedule Report</h2>
            <p class="modal-subtitle">Set up automated report generation</p>
            <div class="modal-form">
              <label class="form-label">Report Type</label>
              <select class="form-input">
                <option value="royalties">Royalties Report</option>
                <option value="analytics">Sales Analytics</option>
                <option value="attribution">Marketing ROI</option>
                <option value="custom">Custom Report</option>
              </select>
              
              <label class="form-label">Frequency</label>
              <select class="form-input" [(ngModel)]="scheduleFrequency">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              
              <label class="form-label">Delivery Time</label>
              <input type="time" class="form-input" [(ngModel)]="scheduleTime">
              
              <label class="form-label">Email To</label>
              <input type="email" class="form-input" placeholder="your@email.com">
              
              <div class="modal-actions">
                <button class="modal-btn secondary" (click)="closeAllModals()">Cancel</button>
                <button class="modal-btn primary" (click)="scheduleReport()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Schedule Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Share Report Modal -->
      <div class="modal-overlay" *ngIf="showShareModal" (click)="closeAllModals()">
        <div class="modal-content modal-sm" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="closeAllModals()">×</button>
          <div class="modal-body">
            <h2 class="modal-title">Share Report</h2>
            <p class="modal-subtitle">Share "{{ selectedReport?.name }}" with others</p>
            <div class="modal-form">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" placeholder="colleague@company.com" [(ngModel)]="shareEmail">
              
              <label class="form-label">Permission</label>
              <select class="form-input">
                <option value="view">Can View</option>
                <option value="download">Can Download</option>
              </select>
              
              <div class="modal-actions">
                <button class="modal-btn secondary" (click)="closeAllModals()">Cancel</button>
                <button class="modal-btn primary" (click)="confirmShare()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  </svg>
                  Share Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-overlay" *ngIf="showDeleteConfirm" (click)="closeAllModals()">
        <div class="modal-content modal-sm" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="closeAllModals()">×</button>
          <div class="modal-body delete-confirm">
            <div class="delete-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </div>
            <h2 class="modal-title">Delete Report?</h2>
            <p class="modal-subtitle">Are you sure you want to delete "{{ selectedReport?.name }}"? This action cannot be undone.</p>
            <div class="modal-actions">
              <button class="modal-btn secondary" (click)="closeAllModals()">Cancel</button>
              <button class="modal-btn danger" (click)="confirmDelete()">Delete Report</button>
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
    }

    /* Quick Stats */
    .quick-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon svg {
      width: 26px;
      height: 26px;
    }

    .stat-icon.blue {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.2) 100%);
      color: #3b82f6;
    }

    .stat-icon.purple {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.2) 100%);
      color: #8b5cf6;
    }

    .stat-icon.green {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.2) 100%);
      color: #10b981;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .stat-number {
      font-size: 1.875rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Filters Bar */
    .filters-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .search-box {
      position: relative;
      flex: 1;
      max-width: 400px;
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
      transition: all 0.2s;
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

    .view-toggle {
      display: flex;
      background: var(--background-subtle);
      padding: 0.25rem;
      border-radius: 8px;
      margin-left: auto;
    }

    .toggle-btn {
      width: 36px;
      height: 36px;
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

    .toggle-btn:hover {
      color: var(--text-primary);
    }

    .toggle-btn.active {
      background: white;
      color: var(--text-primary);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .toggle-btn svg {
      width: 18px;
      height: 18px;
    }

    /* Reports Grid */
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .report-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .report-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    }

    .report-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .report-icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }

    .report-icon svg {
      width: 22px;
      height: 22px;
    }

    .report-icon.royalties {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .report-icon.analytics {
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
    }

    .report-icon.attribution {
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
    }

    .report-icon.email {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .report-icon.custom {
      background: var(--background-subtle);
      color: var(--text-secondary);
    }

    .report-icon.small {
      width: 36px;
      height: 36px;
      border-radius: 8px;
    }

    .report-icon.small svg {
      width: 18px;
      height: 18px;
    }

    .report-status {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.625rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 100px;
    }

    .report-status.ready {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .report-status.generating {
      background: rgba(59, 130, 246, 0.1);
      color: var(--info);
    }

    .report-status.scheduled {
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      background: currentColor;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .report-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.375rem 0;
    }

    .report-description {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin: 0 0 1rem 0;
      line-height: 1.5;
    }

    .report-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.25rem;
      padding-bottom: 1.25rem;
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

    .report-actions {
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
      background: var(--primary-light);
      color: var(--primary);
    }

    .action-btn svg {
      width: 16px;
      height: 16px;
    }

    /* New Report Card */
    .new-report-card {
      border: 2px dashed var(--border-color);
      background: transparent;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      min-height: 280px;
      cursor: pointer;
    }

    .new-report-card:hover {
      border-color: var(--primary);
      background: var(--primary-light);
    }

    .new-report-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--background-subtle);
      border-radius: 50%;
      color: var(--text-muted);
      transition: all 0.2s;
    }

    .new-report-card:hover .new-report-icon {
      background: white;
      color: var(--primary);
    }

    .new-report-icon svg {
      width: 24px;
      height: 24px;
    }

    .new-report-text {
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    /* Reports Table */
    .reports-table {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 120px;
      gap: 1rem;
      padding: 1rem 1.5rem;
      align-items: center;
      border-bottom: 1px solid var(--border-light);
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .table-header {
      background: var(--background-subtle);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    .table-cell {
      font-size: 0.875rem;
    }

    .table-cell.center { text-align: center; }
    .table-cell.right { text-align: right; }

    .report-name-cell {
      display: flex;
      align-items: center;
      gap: 0.875rem;
    }

    .report-info {
      display: flex;
      flex-direction: column;
    }

    .report-title {
      font-weight: 500;
      color: var(--text-primary);
    }

    .report-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .type-badge {
      display: inline-block;
      padding: 0.25rem 0.625rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 6px;
    }

    .type-badge.royalties { background: rgba(16, 185, 129, 0.1); color: var(--success); }
    .type-badge.analytics { background: rgba(59, 130, 246, 0.1); color: var(--accent-blue); }
    .type-badge.attribution { background: rgba(139, 92, 246, 0.1); color: var(--accent-purple); }
    .type-badge.email { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
    .type-badge.custom { background: var(--background-subtle); color: var(--text-secondary); }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.625rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 100px;
    }

    .status-badge.ready { background: rgba(16, 185, 129, 0.1); color: var(--success); }
    .status-badge.generating { background: rgba(59, 130, 246, 0.1); color: var(--info); }
    .status-badge.scheduled { background: rgba(139, 92, 246, 0.1); color: var(--accent-purple); }

    .table-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.25rem;
    }

    /* Templates Section */
    .templates-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-light);
    }

    .templates-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .templates-subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0 0 1.5rem 0;
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .template-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 12px;
      cursor: pointer;
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

    .template-info {
      flex: 1;
    }

    .template-name {
      display: block;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .template-desc {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .template-arrow {
      width: 18px;
      height: 18px;
      color: var(--text-muted);
      opacity: 0;
      transform: translateX(-4px);
      transition: all 0.2s;
    }

    .template-card:hover .template-arrow {
      opacity: 1;
      transform: translateX(0);
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
      max-width: 520px;
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

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .modal-btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 10px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .modal-btn .btn-icon {
      width: 18px;
      height: 18px;
    }

    .modal-btn.primary {
      background: linear-gradient(135deg, rgb(28, 46, 74) 0%, rgb(45, 75, 120) 100%);
      color: white;
    }

    .modal-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(28, 46, 74, 0.3);
    }

    .modal-btn.secondary {
      background: var(--background-subtle);
      color: var(--text-primary);
    }

    .modal-btn.secondary:hover {
      background: var(--border-light);
    }

    .modal-btn.danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    .modal-btn.danger:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
    }

    .modal-sm {
      max-width: 400px;
    }

    .delete-confirm {
      text-align: center;
    }

    .delete-confirm .modal-title {
      margin-top: 0.5rem;
    }

    .delete-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1rem;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .delete-icon svg {
      width: 32px;
      height: 32px;
      color: #ef4444;
    }
  `]
})
export class ReportsListComponent {
  searchQuery = '';
  typeFilter = 'all';
  statusFilter = 'all';
  viewMode = 'grid';
  showNewReportModal = false;
  showScheduleModal = false;
  showShareModal = false;
  showDeleteConfirm = false;
  selectedReport: Report | null = null;
  shareEmail = '';
  scheduleFrequency = 'weekly';
  scheduleTime = '09:00';

  reports: Report[] = [
    { id: '1', name: 'Monthly Royalties Summary', type: 'royalties', description: 'Complete breakdown of royalties across all platforms', lastRun: 'Jan 28, 2025', frequency: 'monthly', status: 'ready', size: '2.4 MB' },
    { id: '2', name: 'Q4 Performance Analysis', type: 'analytics', description: 'Quarter four performance metrics and trends', lastRun: 'Jan 15, 2025', frequency: 'once', status: 'ready', size: '4.1 MB' },
    { id: '3', name: 'Campaign Attribution Report', type: 'attribution', description: 'Marketing campaign ROI and attribution analysis', lastRun: 'Jan 25, 2025', frequency: 'weekly', status: 'ready', size: '1.8 MB' },
    { id: '4', name: 'Email Campaign Stats', type: 'email', description: 'Newsletter and promotional email metrics', lastRun: 'Generating...', frequency: 'weekly', status: 'generating' },
    { id: '5', name: 'Amazon KU Performance', type: 'royalties', description: 'Kindle Unlimited page reads and earnings', lastRun: 'Jan 20, 2025', frequency: 'monthly', status: 'ready', size: '3.2 MB' },
    { id: '6', name: 'Weekly Sales Dashboard', type: 'analytics', description: 'Weekly sales overview across all channels', lastRun: 'Feb 1, 2025', frequency: 'weekly', status: 'scheduled' }
  ];

  templates = [
    { name: 'Royalties Report', description: 'Platform-by-platform earnings', gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>', type: 'royalties' },
    { name: 'Sales Analytics', description: 'Comprehensive sales data', gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)', icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>', type: 'analytics' },
    { name: 'Marketing ROI', description: 'Campaign performance', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>', type: 'attribution' },
    { name: 'Custom Report', description: 'Build your own report', gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>', type: 'custom' }
  ];

  selectedTemplate: any = null;

  // Form fields
  reportName = '';
  dateRange = 'last30';
  selectedPlatforms = ['amazon', 'kobo', 'apple'];
  includeRevenue = true;
  includeSales = true;
  includePageReads = false;
  includeRoyalties = true;

  get scheduledCount(): number {
    return this.reports.filter(r => r.status === 'scheduled' || r.frequency !== 'once').length;
  }

  get recentCount(): number {
    return this.reports.filter(r => r.status === 'ready').length;
  }

  get filteredReports(): Report[] {
    return this.reports.filter(report => {
      const matchesSearch = !this.searchQuery ||
        report.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = this.typeFilter === 'all' || report.type === this.typeFilter;
      const matchesStatus = this.statusFilter === 'all' || report.status === this.statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ready': return 'Ready';
      case 'generating': return 'Generating';
      case 'scheduled': return 'Scheduled';
      default: return status;
    }
  }

  downloadReport(report: Report): void {
    // Simulate download
    const link = document.createElement('a');
    const content = `Report: ${report.name}\nType: ${report.type}\nGenerated: ${report.lastRun}\nDescription: ${report.description}`;
    const blob = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(blob);
    link.download = `${report.name.replace(/\s+/g, '_')}.txt`;
    link.click();
  }

  rerunReport(report: Report): void {
    report.status = 'generating';
    report.lastRun = 'Generating...';

    setTimeout(() => {
      report.status = 'ready';
      report.lastRun = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      report.size = (Math.random() * 4 + 1).toFixed(1) + ' MB';
    }, 2000);
  }

  shareReport(report: Report): void {
    this.selectedReport = report;
    this.shareEmail = '';
    this.showShareModal = true;
  }

  deleteReport(report: Report): void {
    this.selectedReport = report;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (this.selectedReport) {
      this.reports = this.reports.filter(r => r.id !== this.selectedReport!.id);
      this.showDeleteConfirm = false;
      this.selectedReport = null;
    }
  }

  confirmShare(): void {
    if (this.selectedReport && this.shareEmail) {
      // Simulate share
      console.log(`Sharing ${this.selectedReport.name} to ${this.shareEmail}`);
      this.showShareModal = false;
      this.selectedReport = null;
    }
  }

  openScheduleModal(): void {
    this.showScheduleModal = true;
  }

  scheduleReport(): void {
    const newReport: Report = {
      id: (this.reports.length + 1).toString(),
      name: 'Scheduled Report',
      type: 'custom',
      description: `${this.scheduleFrequency} automated report`,
      lastRun: 'Not yet run',
      frequency: this.scheduleFrequency as any,
      status: 'scheduled'
    };
    this.reports.unshift(newReport);
    this.showScheduleModal = false;
  }

  closeAllModals(): void {
    this.showNewReportModal = false;
    this.showScheduleModal = false;
    this.showShareModal = false;
    this.showDeleteConfirm = false;
    this.selectedReport = null;
  }

  useTemplate(template: any): void {
    this.selectedTemplate = template;
    this.reportName = template.name;
    this.showNewReportModal = true;
  }

  openNewReport(): void {
    this.selectedTemplate = null;
    this.reportName = '';
    this.showNewReportModal = true;
  }

  closeModal(): void {
    this.showNewReportModal = false;
    this.selectedTemplate = null;
  }

  togglePlatform(platform: string): void {
    const index = this.selectedPlatforms.indexOf(platform);
    if (index > -1) {
      this.selectedPlatforms.splice(index, 1);
    } else {
      this.selectedPlatforms.push(platform);
    }
  }

  generateReport(): void {
    const newReport: Report = {
      id: (this.reports.length + 1).toString(),
      name: this.reportName || 'Custom Report',
      type: this.selectedTemplate?.type || 'custom',
      description: this.selectedTemplate?.description || 'Custom generated report',
      lastRun: 'Generating...',
      frequency: 'once',
      status: 'generating'
    };
    this.reports.unshift(newReport);
    this.closeModal();

    // Simulate report generation
    setTimeout(() => {
      const report = this.reports.find(r => r.id === newReport.id);
      if (report) {
        report.status = 'ready';
        report.lastRun = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        report.size = (Math.random() * 4 + 1).toFixed(1) + ' MB';
      }
    }, 3000);
  }
}
