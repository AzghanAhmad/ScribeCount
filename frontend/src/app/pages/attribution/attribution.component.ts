import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface AttributionSource {
  name: string;
  revenue: number;
  percentage: number;
  conversions: number;
  color: string;
  icon: string;
}

interface AttributionEvent {
  source: string;
  campaign: string;
  book: string;
  revenue: number;
  confidence: number;
  date: string;
}

@Component({
  selector: 'app-attribution',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">Attribution</h1>
          <p class="page-subtitle">Understand which marketing efforts drive your sales</p>
        </div>
        <div class="header-actions">
          <div class="model-selector">
            <label>Attribution Model:</label>
            <select class="model-select" [(ngModel)]="attributionModel" (change)="onModelChange()">
              <option value="first">First Touch</option>
              <option value="last">Last Touch</option>
              <option value="linear">Linear</option>
              <option value="time-decay">Time Decay</option>
              <option value="position">Position-Based</option>
            </select>
          </div>
          <button class="btn btn-primary" (click)="runAttribution()" [class.loading]="isRunning">
            <svg *ngIf="!isRunning" class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span *ngIf="isRunning" class="loading-spinner"></span>
            {{ isRunning ? 'Analyzing...' : 'Run Attribution' }}
          </button>
        </div>
      </div>

      <!-- Attribution Overview -->
      <div class="overview-grid animate-fade-in-up">
        <div class="overview-card primary">
          <div class="overview-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="overview-content">
            <span class="overview-value">{{'$' + (attributedRevenue | number)}}</span>
            <span class="overview-label">Attributed Revenue</span>
          </div>
          <div class="overview-change up">+18.4%</div>
        </div>
        <div class="overview-card">
          <div class="overview-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </div>
          <div class="overview-content">
            <span class="overview-value">{{ trackedConversions | number }}</span>
            <span class="overview-label">Tracked Conversions</span>
          </div>
          <div class="overview-change up">+24.2%</div>
        </div>
        <div class="overview-card">
          <div class="overview-icon teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </div>
          <div class="overview-content">
            <span class="overview-value">{{ activeChannels }}</span>
            <span class="overview-label">Active Channels</span>
          </div>
          <div class="overview-change neutral">0</div>
        </div>
        <div class="overview-card">
          <div class="overview-icon purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="overview-content">
            <span class="overview-value">{{ avgConfidence }}%</span>
            <span class="overview-label">Avg Confidence</span>
          </div>
          <div class="overview-change up">+5.1%</div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-grid">
        <!-- Source Breakdown Chart -->
        <div class="chart-card animate-fade-in-up" style="animation-delay: 0.1s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Attribution by Source</h3>
              <p class="chart-subtitle">Revenue breakdown by marketing channel</p>
            </div>
          </div>
          <div class="chart-container">
            <canvas #sourceChart></canvas>
          </div>
        </div>

        <!-- Source Cards -->
        <div class="sources-column animate-fade-in-up" style="animation-delay: 0.15s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Top Sources</h3>
              <p class="chart-subtitle">Ranked by attributed revenue</p>
            </div>
          </div>
          <div class="source-cards">
            <div *ngFor="let source of topSources; let i = index" 
                 class="source-card"
                 [style.borderLeftColor]="source.color">
              <div class="source-rank" [class]="getRankClass(i)">{{ i + 1 }}</div>
              <div class="source-icon" [style.backgroundColor]="source.color + '20'" [style.color]="source.color"
                   [innerHTML]="source.icon"></div>
              <div class="source-info">
                <span class="source-name">{{ source.name }}</span>
                <div class="source-stats">
                  <span>{{ source.conversions }} conversions</span>
                  <span class="dot"></span>
                  <span>{{ source.percentage }}%</span>
                </div>
              </div>
              <div class="source-revenue">{{ source.revenue | currency:'USD':'symbol':'1.0-0' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Funnel & Flow -->
      <div class="funnel-section animate-fade-in-up" style="animation-delay: 0.2s">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Conversion Funnel</h3>
              <p class="chart-subtitle">Journey from click to purchase</p>
            </div>
          </div>
          <div class="funnel-container">
            <div *ngFor="let step of funnelSteps; let i = index" class="funnel-step">
              <div class="funnel-bar" 
                   [style.width]="step.percentage + '%'"
                   [style.background]="getFunnelGradient(i)">
                <span class="funnel-label">{{ step.label }}</span>
              </div>
              <div class="funnel-stats">
                <span class="funnel-count">{{ step.count | number }}</span>
                <span class="funnel-drop" *ngIf="i > 0">
                  {{ getDropRate(i) }}% drop
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Attribution Timeline -->
      <div class="timeline-section animate-fade-in-up" style="animation-delay: 0.25s">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Attribution Timeline</h3>
              <p class="chart-subtitle">Recent attributed conversions</p>
            </div>
            <div class="timeline-filters">
              <select class="filter-select" [(ngModel)]="confidenceFilter">
                <option value="all">All Confidence</option>
                <option value="high">High (>80%)</option>
                <option value="medium">Medium (50-80%)</option>
                <option value="low">Low (<50%)</option>
              </select>
            </div>
          </div>
          <div class="timeline-table">
            <div class="timeline-row header">
              <div class="timeline-cell">Source & Campaign</div>
              <div class="timeline-cell">Book</div>
              <div class="timeline-cell center">Revenue</div>
              <div class="timeline-cell center">Confidence</div>
              <div class="timeline-cell right">Date</div>
            </div>
            <div *ngFor="let event of filteredEvents" class="timeline-row">
              <div class="timeline-cell source-info">
                <span class="event-source">{{ event.source }}</span>
                <span class="event-campaign">{{ event.campaign }}</span>
              </div>
              <div class="timeline-cell">{{ event.book }}</div>
              <div class="timeline-cell center revenue">{{ event.revenue | currency:'USD':'symbol':'1.2-2' }}</div>
              <div class="timeline-cell center">
                <div class="confidence-bar">
                  <div class="confidence-fill" 
                       [style.width]="event.confidence + '%'"
                       [class.high]="event.confidence >= 80"
                       [class.medium]="event.confidence >= 50 && event.confidence < 80"
                       [class.low]="event.confidence < 50"></div>
                </div>
                <span class="confidence-value">{{ event.confidence }}%</span>
              </div>
              <div class="timeline-cell right date">{{ event.date }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Grid - Insights -->
      <div class="bottom-grid animate-fade-in-up" style="animation-delay: 0.3s">
        <!-- Multi-touch Journeys -->
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Multi-Touch Journeys</h3>
              <p class="chart-subtitle">Common paths to conversion</p>
            </div>
          </div>
          <div class="journeys-list">
            <div *ngFor="let journey of journeys" class="journey-item">
              <div class="journey-path">
                <span *ngFor="let touch of journey.touchpoints; let last = last" class="journey-touch">
                  <span class="touch-label" [style.backgroundColor]="touch.color + '20'" [style.color]="touch.color">
                    {{ touch.name }}
                  </span>
                  <svg *ngIf="!last" class="journey-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </span>
              </div>
              <div class="journey-stats">
                <span class="journey-conversions">{{ journey.conversions }} conversions</span>
                <span class="journey-percentage">{{ journey.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Channel Comparison -->
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Channel Comparison</h3>
              <p class="chart-subtitle">Performance by channel type</p>
            </div>
          </div>
          <div class="chart-container small">
            <canvas #channelChart></canvas>
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
      align-items: center;
      gap: 1rem;
    }

    .model-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .model-selector label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .model-select {
      padding: 0.5rem 2rem 0.5rem 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 0.875rem;
      background: white;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.5rem center;
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

    .btn-primary.loading {
      pointer-events: none;
      opacity: 0.9;
    }

    .loading-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Overview Grid */
    .overview-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 1024px) {
      .overview-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .overview-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 14px;
      transition: all 0.3s ease;
    }

    .overview-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    }

    .overview-card.primary {
      background: linear-gradient(135deg, rgb(28, 46, 74) 0%, rgb(45, 75, 120) 100%);
      border: none;
      color: white;
    }

    .overview-card.primary .overview-label {
      color: rgba(255, 255, 255, 0.7);
    }

    .overview-card.primary .overview-change {
      background: rgba(255, 255, 255, 0.15);
      color: #6ee7b7;
    }

    .overview-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
    }

    .overview-icon:not(:first-child) {
      background: var(--primary-light);
    }

    .overview-icon.blue {
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
    }

    .overview-icon.teal {
      background: rgba(20, 184, 166, 0.1);
      color: var(--accent-teal);
    }

    .overview-icon.purple {
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
    }

    .overview-icon svg {
      width: 24px;
      height: 24px;
    }

    .overview-content {
      flex: 1;
    }

    .overview-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.2;
    }

    .overview-label {
      display: block;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .overview-change {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 6px;
    }

    .overview-change.up {
      background: rgba(16, 185, 129, 0.1);
      color: var(--trend-up);
    }

    .overview-change.down {
      background: rgba(239, 68, 68, 0.1);
      color: var(--trend-down);
    }

    .overview-change.neutral {
      background: var(--background-subtle);
      color: var(--text-muted);
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
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

    .chart-container {
      height: 280px;
      position: relative;
    }

    .chart-container.small {
      height: 220px;
    }

    /* Source Cards */
    .sources-column {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
    }

    .source-cards {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .source-card {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 1rem;
      background: var(--background);
      border-radius: 12px;
      border-left: 3px solid;
      transition: all 0.2s ease;
    }

    .source-card:hover {
      background: var(--primary-light);
      transform: translateX(4px);
    }

    .source-rank {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 6px;
      background: var(--background-subtle);
      color: var(--text-muted);
    }

    .source-rank.gold {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
    }

    .source-rank.silver {
      background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
      color: white;
    }

    .source-rank.bronze {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      color: white;
    }

    .source-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }

    .source-icon svg,
    .source-icon :global(svg) {
      width: 18px;
      height: 18px;
    }

    .source-info {
      flex: 1;
    }

    .source-name {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .source-stats {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .source-stats .dot {
      width: 3px;
      height: 3px;
      background: var(--text-muted);
      border-radius: 50%;
    }

    .source-revenue {
      font-size: 0.9375rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    /* Funnel Section */
    .funnel-section {
      margin-bottom: 1.5rem;
    }

    .funnel-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .funnel-step {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .funnel-bar {
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      min-width: 120px;
      transition: width 0.5s ease;
    }

    .funnel-label {
      color: white;
      font-size: 0.8125rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .funnel-stats {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .funnel-count {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .funnel-drop {
      font-size: 0.75rem;
      color: var(--trend-down);
      background: rgba(239, 68, 68, 0.1);
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
    }

    /* Timeline Section */
    .timeline-section {
      margin-bottom: 1.5rem;
    }

    .timeline-filters {
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

    .timeline-table {
      display: flex;
      flex-direction: column;
    }

    .timeline-row {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1fr 1.5fr 1fr;
      gap: 1rem;
      padding: 0.875rem 0;
      border-bottom: 1px solid var(--border-light);
      align-items: center;
    }

    .timeline-row.header {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      border-bottom: 2px solid var(--border-light);
    }

    .timeline-row:last-child {
      border-bottom: none;
    }

    .timeline-cell {
      font-size: 0.875rem;
    }

    .timeline-cell.center { text-align: center; }
    .timeline-cell.right { text-align: right; }

    .timeline-cell.source-info {
      display: flex;
      flex-direction: column;
    }

    .event-source {
      font-weight: 500;
      color: var(--text-primary);
    }

    .event-campaign {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .timeline-cell.revenue {
      font-weight: 600;
      color: var(--success);
    }

    .timeline-cell.date {
      color: var(--text-muted);
    }

    .confidence-bar {
      width: 60px;
      height: 6px;
      background: var(--background-subtle);
      border-radius: 3px;
      overflow: hidden;
      display: inline-block;
      margin-right: 0.5rem;
    }

    .confidence-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .confidence-fill.high { background: var(--trend-up); }
    .confidence-fill.medium { background: var(--warning); }
    .confidence-fill.low { background: var(--trend-down); }

    .confidence-value {
      font-size: 0.75rem;
      font-weight: 500;
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

    /* Journeys */
    .journeys-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .journey-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: var(--background);
      border-radius: 10px;
      transition: background 0.2s;
    }

    .journey-item:hover {
      background: var(--primary-light);
    }

    .journey-path {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .journey-touch {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .touch-label {
      padding: 0.25rem 0.625rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 100px;
    }

    .journey-arrow {
      width: 16px;
      height: 16px;
      color: var(--text-muted);
    }

    .journey-stats {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .journey-conversions {
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .journey-percentage {
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
  `]
})
export class AttributionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sourceChart') sourceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('channelChart') channelChartRef!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];
  attributionModel = 'last';
  confidenceFilter = 'all';
  isRunning = false;

  // Overview metrics
  attributedRevenue = 47290;
  trackedConversions = 1247;
  activeChannels = 12;
  avgConfidence = 87;

  topSources: AttributionSource[] = [
    { name: 'Email Newsletter', revenue: 18500, percentage: 39, conversions: 485, color: '#8b5cf6', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { name: 'Facebook Ads', revenue: 12400, percentage: 26, conversions: 324, color: '#3b82f6', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' },
    { name: 'BookBub', revenue: 8200, percentage: 17, conversions: 218, color: '#f59e0b', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
    { name: 'Organic Search', revenue: 5600, percentage: 12, conversions: 148, color: '#10b981', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' },
    { name: 'Direct Links', revenue: 2590, percentage: 6, conversions: 72, color: '#64748b', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' }
  ];

  funnelSteps = [
    { label: 'Link Clicks', count: 45280, percentage: 100 },
    { label: 'Website Visits', count: 32450, percentage: 72 },
    { label: 'Product Views', count: 18620, percentage: 41 },
    { label: 'Add to Cart', count: 4850, percentage: 11 },
    { label: 'Purchases', count: 1247, percentage: 3 }
  ];

  attributionEvents: AttributionEvent[] = [
    { source: 'Email', campaign: 'January Newsletter', book: 'The Midnight Library', revenue: 4.99, confidence: 95, date: 'Today, 2:34pm' },
    { source: 'Facebook', campaign: 'Winter Promo', book: 'Atomic Habits', revenue: 12.99, confidence: 82, date: 'Today, 1:15pm' },
    { source: 'BookBub', campaign: 'Featured Deal', book: 'Project Hail Mary', revenue: 2.99, confidence: 88, date: 'Today, 11:42am' },
    { source: 'Organic', campaign: 'Google Search', book: 'The Midnight Library', revenue: 4.99, confidence: 65, date: 'Today, 10:20am' },
    { source: 'Email', campaign: 'New Release', book: 'Where the Crawdads Sing', revenue: 9.99, confidence: 92, date: 'Yesterday' },
    { source: 'Direct', campaign: 'Author Website', book: 'Atomic Habits', revenue: 14.99, confidence: 45, date: 'Yesterday' }
  ];

  journeys = [
    {
      touchpoints: [
        { name: 'Email', color: '#8b5cf6' },
        { name: 'Website', color: '#3b82f6' },
        { name: 'Purchase', color: '#10b981' }
      ],
      conversions: 385,
      percentage: 31
    },
    {
      touchpoints: [
        { name: 'Social', color: '#3b82f6' },
        { name: 'Email', color: '#8b5cf6' },
        { name: 'Purchase', color: '#10b981' }
      ],
      conversions: 248,
      percentage: 20
    },
    {
      touchpoints: [
        { name: 'BookBub', color: '#f59e0b' },
        { name: 'Purchase', color: '#10b981' }
      ],
      conversions: 218,
      percentage: 18
    },
    {
      touchpoints: [
        { name: 'Organic', color: '#14b8a6' },
        { name: 'Website', color: '#3b82f6' },
        { name: 'Email', color: '#8b5cf6' },
        { name: 'Purchase', color: '#10b981' }
      ],
      conversions: 156,
      percentage: 13
    }
  ];

  get filteredEvents(): AttributionEvent[] {
    if (this.confidenceFilter === 'all') return this.attributionEvents;
    if (this.confidenceFilter === 'high') return this.attributionEvents.filter(e => e.confidence >= 80);
    if (this.confidenceFilter === 'medium') return this.attributionEvents.filter(e => e.confidence >= 50 && e.confidence < 80);
    return this.attributionEvents.filter(e => e.confidence < 50);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }

  getRankClass(index: number): string {
    if (index === 0) return 'gold';
    if (index === 1) return 'silver';
    if (index === 2) return 'bronze';
    return '';
  }

  getFunnelGradient(index: number): string {
    const gradients = [
      'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
      'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
      'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)',
      'linear-gradient(90deg, #a855f7 0%, #c084fc 100%)',
      'linear-gradient(90deg, #10b981 0%, #14b8a6 100%)'
    ];
    return gradients[index] || gradients[0];
  }

  getDropRate(index: number): number {
    const prev = this.funnelSteps[index - 1].count;
    const curr = this.funnelSteps[index].count;
    return Math.round((1 - curr / prev) * 100);
  }

  private initCharts(): void {
    this.createSourceChart();
    this.createChannelChart();
  }

  private createSourceChart(): void {
    const ctx = this.sourceChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.topSources.map(s => s.name),
        datasets: [{
          data: this.topSources.map(s => s.revenue),
          backgroundColor: this.topSources.map(s => s.color),
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => `$${ctx.parsed.toLocaleString()}`
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createChannelChart(): void {
    const ctx = this.channelChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Email', 'Social', 'Search', 'Referral', 'Direct'],
        datasets: [
          {
            label: 'This Month',
            data: [18500, 12400, 5600, 8200, 2590],
            backgroundColor: '#3b82f6',
            borderRadius: 4
          },
          {
            label: 'Last Month',
            data: [15200, 11800, 4900, 7400, 2100],
            backgroundColor: '#94a3b8',
            borderRadius: 4
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
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ctx.parsed.y != null ? `$${(ctx.parsed.y as number).toLocaleString()}` : ''
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { size: 11 } }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              color: '#64748b',
              callback: (value) => '$' + (Number(value) / 1000) + 'K'
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  onModelChange(): void {
    console.log('Attribution model changed to:', this.attributionModel);
    // Mark that model has changed but results are stale
  }

  runAttribution(): void {
    this.isRunning = true;

    // Simulate attribution analysis
    setTimeout(() => {
      // Generate different results based on model
      const modelMultipliers: Record<string, number> = {
        'first': 0.85,
        'last': 1.0,
        'linear': 0.92,
        'time-decay': 0.95,
        'position': 0.88
      };

      const multiplier = modelMultipliers[this.attributionModel] || 1;

      // Update overview metrics
      this.attributedRevenue = Math.floor(47290 * multiplier + (Math.random() * 5000 - 2500));
      this.trackedConversions = Math.floor(1247 * multiplier + (Math.random() * 200 - 100));
      this.avgConfidence = Math.floor(87 * multiplier + (Math.random() * 8 - 4));
      if (this.avgConfidence > 100) this.avgConfidence = 100;

      // Update source percentages based on model
      if (this.attributionModel === 'first') {
        this.topSources[0].percentage = 45; // Email gets more credit
        this.topSources[1].percentage = 20;
        this.topSources[2].percentage = 18;
        this.topSources[3].percentage = 12;
        this.topSources[4].percentage = 5;
      } else if (this.attributionModel === 'linear') {
        this.topSources[0].percentage = 25; // More evenly distributed
        this.topSources[1].percentage = 22;
        this.topSources[2].percentage = 20;
        this.topSources[3].percentage = 18;
        this.topSources[4].percentage = 15;
      } else {
        this.topSources[0].percentage = 39;
        this.topSources[1].percentage = 26;
        this.topSources[2].percentage = 17;
        this.topSources[3].percentage = 12;
        this.topSources[4].percentage = 6;
      }

      this.isRunning = false;
    }, 1500);
  }
}
