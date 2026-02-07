import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface MetricCard {
  label: string;
  value: string;
  previousValue: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">Analytics</h1>
          <p class="page-subtitle">Deep dive into your royalties performance and trends</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="exportData()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export Data
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="filters-card animate-fade-in-up" [class.filters-active]="filtersApplied">
        <div class="filters-grid">
          <div class="filter-group">
            <label>Date Range</label>
            <select class="filter-select" [(ngModel)]="dateRange">
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="last365">Last 12 months</option>
              <option value="ytd">Year to date</option>
              <option value="all">All time</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Pen Name</label>
            <select class="filter-select" [(ngModel)]="penName">
              <option value="all">All Pen Names</option>
              <option value="pen1">Romance Author</option>
              <option value="pen2">Thriller Writer</option>
              <option value="pen3">Fantasy Sage</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Platform</label>
            <select class="filter-select" [(ngModel)]="platform">
              <option value="all">All Platforms</option>
              <option value="amazon">Amazon</option>
              <option value="kobo">Kobo</option>
              <option value="apple">Apple Books</option>
              <option value="google">Google Play</option>
              <option value="bn">Barnes & Noble</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Format</label>
            <select class="filter-select" [(ngModel)]="format">
              <option value="all">All Formats</option>
              <option value="ebook">Ebook</option>
              <option value="paperback">Paperback</option>
              <option value="hardcover">Hardcover</option>
              <option value="audio">Audiobook</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Distribution</label>
            <select class="filter-select" [(ngModel)]="distribution">
              <option value="all">All</option>
              <option value="ku">Kindle Unlimited</option>
              <option value="wide">Wide</option>
            </select>
          </div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-apply" (click)="applyFilters()" [class.loading]="isLoading">
              <span *ngIf="!isLoading">Apply Filters</span>
              <span *ngIf="isLoading" class="loading-spinner"></span>
            </button>
            <button class="btn btn-ghost" (click)="resetFilters()">Reset</button>
          </div>
        </div>
        <div class="active-filters" *ngIf="filtersApplied">
          <span class="active-filter-label">Active filters:</span>
          <span class="filter-tag" *ngIf="dateRange !== 'last30'">{{ getDateRangeLabel() }}</span>
          <span class="filter-tag" *ngIf="penName !== 'all'">{{ getPenNameLabel() }}</span>
          <span class="filter-tag" *ngIf="platform !== 'all'">{{ getPlatformLabel() }}</span>
          <span class="filter-tag" *ngIf="format !== 'all'">{{ getFormatLabel() }}</span>
          <span class="filter-tag" *ngIf="distribution !== 'all'">{{ getDistributionLabel() }}</span>
        </div>
      </div>

      <!-- Comparison Metrics -->
      <div class="metrics-grid animate-fade-in-up" style="animation-delay: 0.1s">
        <div *ngFor="let metric of metrics; let i = index" class="metric-card" [style.animationDelay]="(i * 0.05) + 's'">
          <div class="metric-header">
            <span class="metric-label">{{ metric.label }}</span>
            <span class="metric-badge" [class]="metric.trend">
              <svg *ngIf="metric.trend === 'up'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              <svg *ngIf="metric.trend === 'down'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              {{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%
            </span>
          </div>
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-comparison">
            <span class="comparison-label">Previous period:</span>
            <span class="comparison-value">{{ metric.previousValue }}</span>
          </div>
          <div class="metric-bar">
            <div class="metric-bar-fill" [class]="metric.trend" [style.width]="getBarWidth(metric)"></div>
          </div>
        </div>
      </div>

      <!-- Main Charts Section -->
      <div class="charts-section">
        <!-- Period Over Period Comparison -->
        <div class="chart-card full-width animate-fade-in-up" style="animation-delay: 0.2s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Period-over-Period Comparison</h3>
              <p class="chart-subtitle">Compare your performance across different time periods</p>
            </div>
            <div class="chart-legend-inline">
              <span class="legend-item"><span class="dot current"></span> Current Period</span>
              <span class="legend-item"><span class="dot previous"></span> Previous Period</span>
            </div>
          </div>
          <div class="chart-container large">
            <canvas #comparisonChart></canvas>
          </div>
        </div>

        <!-- Two-Column Charts -->
        <div class="charts-grid-2">
          <!-- Revenue by Platform -->
          <div class="chart-card animate-fade-in-up" style="animation-delay: 0.3s">
            <div class="chart-header">
              <div class="chart-title-group">
                <h3 class="chart-title">Revenue by Platform</h3>
                <p class="chart-subtitle">Platform performance breakdown</p>
              </div>
            </div>
            <div class="chart-container">
              <canvas #platformRevenueChart></canvas>
            </div>
          </div>

          <!-- KU vs Wide Performance -->
          <div class="chart-card animate-fade-in-up" style="animation-delay: 0.35s">
            <div class="chart-header">
              <div class="chart-title-group">
                <h3 class="chart-title">KU vs Wide Distribution</h3>
                <p class="chart-subtitle">Exclusive vs wide comparison</p>
              </div>
            </div>
            <div class="chart-container">
              <canvas #kuWideChart></canvas>
            </div>
          </div>
        </div>

        <!-- Three-Column Charts -->
        <div class="charts-grid-3">
          <!-- Revenue Heatmap -->
          <div class="chart-card animate-fade-in-up" style="animation-delay: 0.4s">
            <div class="chart-header">
              <div class="chart-title-group">
                <h3 class="chart-title">Sales Heatmap</h3>
                <p class="chart-subtitle">Peak sales hours & days</p>
              </div>
            </div>
            <div class="heatmap-container">
              <div class="heatmap-grid">
                <div class="heatmap-row" *ngFor="let row of heatmapData; let dayIndex = index">
                  <span class="heatmap-label">{{ ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex] }}</span>
                  <div class="heatmap-cells">
                    <div *ngFor="let value of row; let hourIndex = index" 
                         class="heatmap-cell" 
                         [style.backgroundColor]="getHeatmapColor(value)"
                         [title]="getHeatmapTooltip(dayIndex, hourIndex, value)">
                    </div>
                  </div>
                </div>
              </div>
              <div class="heatmap-x-labels">
                <span>12am</span>
                <span>6am</span>
                <span>12pm</span>
                <span>6pm</span>
                <span>11pm</span>
              </div>
              <div class="heatmap-legend">
                <span class="heatmap-legend-label">Less</span>
                <div class="heatmap-legend-gradient"></div>
                <span class="heatmap-legend-label">More</span>
              </div>
            </div>
          </div>

          <!-- Genre Performance -->
          <div class="chart-card animate-fade-in-up" style="animation-delay: 0.45s">
            <div class="chart-header">
              <div class="chart-title-group">
                <h3 class="chart-title">Genre Performance</h3>
                <p class="chart-subtitle">Revenue by genre</p>
              </div>
            </div>
            <div class="chart-container">
              <canvas #genreChart></canvas>
            </div>
          </div>

          <!-- Trend Analysis -->
          <div class="chart-card animate-fade-in-up" style="animation-delay: 0.5s">
            <div class="chart-header">
              <div class="chart-title-group">
                <h3 class="chart-title">Trend Direction</h3>
                <p class="chart-subtitle">Key metric trajectories</p>
              </div>
            </div>
            <div class="trends-container">
              <div class="trend-item" *ngFor="let trend of trends">
                <div class="trend-icon" [class]="trend.type">
                  <svg *ngIf="trend.type === 'up'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                  <svg *ngIf="trend.type === 'down'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  <svg *ngIf="trend.type === 'neutral'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <div class="trend-info">
                  <span class="trend-label">{{ trend.label }}</span>
                  <span class="trend-value" [class]="trend.type">{{ trend.value }}</span>
                </div>
                <div class="trend-sparkline">
                  <svg viewBox="0 0 60 20" class="sparkline" [class]="trend.type">
                    <polyline [attr.points]="trend.sparkline" fill="none" stroke-width="2"/>
                  </svg>
                </div>
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
      color: var(--text-primary);
      background: var(--background-subtle);
    }

    /* Filters Card */
    .filters-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr) auto;
      gap: 1rem;
      align-items: end;
    }

    @media (max-width: 1200px) {
      .filters-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .filters-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .filter-group label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .filter-select {
      padding: 0.625rem 2.5rem 0.625rem 0.875rem;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      font-size: 0.875rem;
      background: white;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.5rem center;
      background-size: 18px;
      transition: all 0.2s ease;
    }

    .filter-select:hover {
      border-color: var(--text-muted);
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .filter-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-apply {
      white-space: nowrap;
      min-width: 120px;
    }

    .btn-apply.loading {
      pointer-events: none;
      opacity: 0.8;
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

    .filters-active {
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .active-filters {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      padding-top: 1rem;
      margin-top: 1rem;
      border-top: 1px solid var(--border-light);
    }

    .active-filter-label {
      font-size: 0.8125rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .filter-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.75rem;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
      color: var(--accent-blue);
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 20px;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 1200px) {
      .metrics-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .metric-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 14px;
      padding: 1.25rem;
      transition: all 0.3s ease;
    }

    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }

    .metric-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .metric-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-muted);
    }

    .metric-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.125rem;
      padding: 0.125rem 0.375rem;
      font-size: 0.6875rem;
      font-weight: 600;
      border-radius: 4px;
    }

    .metric-badge svg {
      width: 12px;
      height: 12px;
    }

    .metric-badge.up {
      background: rgba(16, 185, 129, 0.1);
      color: var(--trend-up);
    }

    .metric-badge.down {
      background: rgba(239, 68, 68, 0.1);
      color: var(--trend-down);
    }

    .metric-badge.neutral {
      background: var(--background-subtle);
      color: var(--text-muted);
    }

    .metric-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .metric-comparison {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }

    .comparison-value {
      font-weight: 500;
      color: var(--text-secondary);
    }

    .metric-bar {
      height: 4px;
      background: var(--background-subtle);
      border-radius: 2px;
      overflow: hidden;
    }

    .metric-bar-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.5s ease;
    }

    .metric-bar-fill.up {
      background: linear-gradient(90deg, #10b981 0%, #14b8a6 100%);
    }

    .metric-bar-fill.down {
      background: linear-gradient(90deg, #ef4444 0%, #f59e0b 100%);
    }

    .metric-bar-fill.neutral {
      background: var(--text-muted);
    }

    /* Charts Section */
    .charts-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .chart-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .chart-card.full-width {
      width: 100%;
    }

    .charts-grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .charts-grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    @media (max-width: 1200px) {
      .charts-grid-3 {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .charts-grid-2,
      .charts-grid-3 {
        grid-template-columns: 1fr;
      }
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

    .chart-legend-inline {
      display: flex;
      gap: 1.5rem;
    }

    .chart-legend-inline .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .chart-legend-inline .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .chart-legend-inline .dot.current {
      background: #3b82f6;
    }

    .chart-legend-inline .dot.previous {
      background: #94a3b8;
    }

    .chart-container {
      height: 280px;
      position: relative;
    }

    .chart-container.large {
      height: 350px;
    }

    /* Heatmap Styles */
    .heatmap-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .heatmap-grid {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .heatmap-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .heatmap-label {
      width: 28px;
      font-size: 0.6875rem;
      color: var(--text-muted);
      text-align: right;
    }

    .heatmap-cells {
      display: flex;
      gap: 2px;
      flex: 1;
    }

    .heatmap-cell {
      flex: 1;
      height: 16px;
      border-radius: 2px;
      cursor: pointer;
      transition: transform 0.15s ease;
    }

    .heatmap-cell:hover {
      transform: scale(1.2);
      z-index: 1;
    }

    .heatmap-x-labels {
      display: flex;
      justify-content: space-between;
      padding-left: 36px;
      font-size: 0.625rem;
      color: var(--text-muted);
    }

    .heatmap-legend {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .heatmap-legend-label {
      font-size: 0.6875rem;
      color: var(--text-muted);
    }

    .heatmap-legend-gradient {
      width: 100px;
      height: 8px;
      background: linear-gradient(90deg, #e2e8f0 0%, #3b82f6 50%, #6366f1 100%);
      border-radius: 4px;
    }

    /* Trends Container */
    .trends-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .trend-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem;
      background: var(--background);
      border-radius: 10px;
      transition: all 0.2s ease;
    }

    .trend-item:hover {
      background: var(--primary-light);
    }

    .trend-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }

    .trend-icon svg {
      width: 18px;
      height: 18px;
    }

    .trend-icon.up {
      background: rgba(16, 185, 129, 0.15);
      color: var(--trend-up);
    }

    .trend-icon.down {
      background: rgba(239, 68, 68, 0.15);
      color: var(--trend-down);
    }

    .trend-icon.neutral {
      background: var(--background-subtle);
      color: var(--text-muted);
    }

    .trend-info {
      flex: 1;
    }

    .trend-label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .trend-value {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .trend-value.up { color: var(--trend-up); }
    .trend-value.down { color: var(--trend-down); }
    .trend-value.neutral { color: var(--text-muted); }

    .trend-sparkline {
      width: 60px;
      height: 20px;
    }

    .sparkline {
      width: 100%;
      height: 100%;
    }

    .sparkline.up { stroke: var(--trend-up); }
    .sparkline.down { stroke: var(--trend-down); }
    .sparkline.neutral { stroke: var(--text-muted); }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .animate-fade-in-up {
      opacity: 0;
      animation: fadeInUp 0.5s ease-out forwards;
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
export class AnalyticsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('comparisonChart') comparisonChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('platformRevenueChart') platformRevenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('kuWideChart') kuWideChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('genreChart') genreChartRef!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];

  // Filters
  dateRange = 'last30';
  penName = 'all';
  platform = 'all';
  format = 'all';
  distribution = 'all';
  isLoading = false;
  filtersApplied = false;

  metrics: MetricCard[] = [
    { label: 'Total Revenue', value: '$24,847', previousValue: '$22,100', change: 12.4, trend: 'up' },
    { label: 'Books Sold', value: '3,247', previousValue: '2,890', change: 12.4, trend: 'up' },
    { label: 'Page Reads', value: '847K', previousValue: '734K', change: 15.4, trend: 'up' },
    { label: 'Avg. Order', value: '$7.65', previousValue: '$7.64', change: 0.1, trend: 'neutral' },
    { label: 'Conversion', value: '3.2%', previousValue: '3.8%', change: -15.8, trend: 'down' }
  ];

  trends = [
    { label: 'Ebook Revenue', value: '+15.3%', type: 'up', sparkline: '0,15 10,12 20,8 30,10 40,5 50,3 60,0' },
    { label: 'Audio Downloads', value: '-2.1%', type: 'down', sparkline: '0,5 10,8 20,6 30,10 40,12 50,14 60,15' },
    { label: 'Print Sales', value: '0%', type: 'neutral', sparkline: '0,10 10,10 20,11 30,9 40,10 50,10 60,10' },
    { label: 'KU Pages', value: '+8.7%', type: 'up', sparkline: '0,18 10,14 20,12 30,10 40,8 50,5 60,2' },
    { label: 'Wide Revenue', value: '+4.2%', type: 'up', sparkline: '0,12 10,11 20,10 30,9 40,7 50,5 60,4' }
  ];

  // Generate heatmap data (7 days x 24 hours)
  heatmapData: number[][] = [];

  constructor() {
    // Generate random heatmap data
    for (let day = 0; day < 7; day++) {
      const row: number[] = [];
      for (let hour = 0; hour < 24; hour++) {
        // More sales during certain hours (9am-9pm)
        const baseValue = (hour >= 9 && hour <= 21) ? 0.5 : 0.2;
        row.push(Math.random() * 0.5 + baseValue);
      }
      this.heatmapData.push(row);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }

  getBarWidth(metric: MetricCard): string {
    const maxChange = 20;
    const width = Math.min(Math.abs(metric.change) / maxChange * 100, 100);
    return width + '%';
  }

  getHeatmapColor(value: number): string {
    // Interpolate between light gray to blue to purple
    if (value < 0.3) {
      return `rgba(226, 232, 240, ${0.5 + value})`;
    } else if (value < 0.6) {
      const intensity = (value - 0.3) / 0.3;
      return `rgba(59, 130, 246, ${0.3 + intensity * 0.5})`;
    } else {
      const intensity = (value - 0.6) / 0.4;
      return `rgba(99, 102, 241, ${0.6 + intensity * 0.4})`;
    }
  }

  getHeatmapTooltip(dayIndex: number, hourIndex: number, value: number): string {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hour = hourIndex > 12 ? `${hourIndex - 12}pm` : hourIndex === 0 ? '12am' : `${hourIndex}am`;
    const sales = Math.round(value * 50);
    return `${days[dayIndex]} ${hour}: ${sales} sales`;
  }

  private initCharts(): void {
    this.createComparisonChart();
    this.createPlatformRevenueChart();
    this.createKuWideChart();
    this.createGenreChart();
  }

  private createComparisonChart(): void {
    const ctx = this.comparisonChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        datasets: [
          {
            label: 'Current Period',
            data: [4200, 5100, 4800, 5600, 6200],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6'
          },
          {
            label: 'Previous Period',
            data: [3800, 4200, 4500, 4800, 5100],
            borderColor: '#94a3b8',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#94a3b8'
          }
        ]
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
              label: (ctx) => ctx.parsed.y != null ? `${ctx.dataset.label}: $${(ctx.parsed.y as number).toLocaleString()}` : ''
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
              callback: (value) => '$' + (Number(value) / 1000) + 'K'
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createPlatformRevenueChart(): void {
    const ctx = this.platformRevenueChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Amazon', 'Kobo', 'Apple', 'Google', 'B&N'],
        datasets: [{
          data: [12500, 4200, 3800, 2100, 1800],
          backgroundColor: [
            '#3b82f6',
            '#8b5cf6',
            '#14b8a6',
            '#f59e0b',
            '#64748b'
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
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ctx.parsed.y != null ? `$${(ctx.parsed.y as number).toLocaleString()}` : ''
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
              callback: (value) => '$' + (Number(value) / 1000) + 'K'
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createKuWideChart(): void {
    const ctx = this.kuWideChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Kindle Unlimited', 'Wide Distribution'],
        datasets: [{
          data: [65, 35],
          backgroundColor: ['#3b82f6', '#14b8a6'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
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

  private createGenreChart(): void {
    const ctx = this.genreChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Romance', 'Thriller', 'Fantasy', 'Sci-Fi', 'Non-Fiction', 'Mystery'],
        datasets: [{
          label: 'Revenue',
          data: [85, 72, 65, 58, 45, 52],
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: '#6366f1',
          borderWidth: 2,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#6366f1'
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
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              display: false
            },
            grid: {
              color: 'rgba(0,0,0,0.05)'
            },
            pointLabels: {
              color: '#64748b',
              font: { size: 11 }
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  // Filter Methods
  exportData(): void {
    const data = {
      dateRange: this.dateRange,
      penName: this.penName,
      platform: this.platform,
      format: this.format,
      distribution: this.distribution,
      metrics: this.metrics,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  applyFilters(): void {
    this.isLoading = true;

    // Simulate API call delay
    setTimeout(() => {
      // Update metrics based on filters (simulated data changes)
      const multiplier = this.getFilterMultiplier();
      this.metrics = [
        { label: 'Total Revenue', value: '$' + Math.floor(24847 * multiplier).toLocaleString(), previousValue: '$22,100', change: Math.floor(12.4 * multiplier), trend: multiplier > 0.8 ? 'up' : 'down' },
        { label: 'Books Sold', value: Math.floor(3247 * multiplier).toLocaleString(), previousValue: '2,890', change: Math.floor(12.4 * multiplier), trend: multiplier > 0.8 ? 'up' : 'down' },
        { label: 'Page Reads', value: Math.floor(847 * multiplier) + 'K', previousValue: '734K', change: Math.floor(15.4 * multiplier), trend: multiplier > 0.8 ? 'up' : 'down' },
        { label: 'Avg. Order', value: '$' + (7.65 * multiplier).toFixed(2), previousValue: '$7.64', change: Math.floor(0.1 * multiplier * 10) / 10, trend: 'neutral' },
        { label: 'Conversion', value: (3.2 * multiplier).toFixed(1) + '%', previousValue: '3.8%', change: Math.floor(-15.8 * multiplier), trend: 'down' }
      ];

      this.isLoading = false;
      this.filtersApplied = this.dateRange !== 'last30' || this.penName !== 'all' ||
        this.platform !== 'all' || this.format !== 'all' || this.distribution !== 'all';
    }, 800);
  }

  resetFilters(): void {
    this.dateRange = 'last30';
    this.penName = 'all';
    this.platform = 'all';
    this.format = 'all';
    this.distribution = 'all';
    this.filtersApplied = false;

    // Reset metrics to original values
    this.metrics = [
      { label: 'Total Revenue', value: '$24,847', previousValue: '$22,100', change: 12.4, trend: 'up' },
      { label: 'Books Sold', value: '3,247', previousValue: '2,890', change: 12.4, trend: 'up' },
      { label: 'Page Reads', value: '847K', previousValue: '734K', change: 15.4, trend: 'up' },
      { label: 'Avg. Order', value: '$7.65', previousValue: '$7.64', change: 0.1, trend: 'neutral' },
      { label: 'Conversion', value: '3.2%', previousValue: '3.8%', change: -15.8, trend: 'down' }
    ];
  }

  private getFilterMultiplier(): number {
    let multiplier = 1;

    // Date range affects data
    switch (this.dateRange) {
      case 'last7': multiplier *= 0.3; break;
      case 'last90': multiplier *= 2.5; break;
      case 'last365': multiplier *= 8; break;
      case 'ytd': multiplier *= 1.5; break;
      case 'all': multiplier *= 12; break;
    }

    // Platform filter
    if (this.platform !== 'all') multiplier *= 0.4;

    // Pen name filter
    if (this.penName !== 'all') multiplier *= 0.35;

    // Format filter
    if (this.format !== 'all') multiplier *= 0.5;

    // Distribution filter
    if (this.distribution !== 'all') multiplier *= 0.6;

    return multiplier;
  }

  getDateRangeLabel(): string {
    const labels: Record<string, string> = {
      'last7': 'Last 7 days',
      'last30': 'Last 30 days',
      'last90': 'Last 90 days',
      'last365': 'Last 12 months',
      'ytd': 'Year to date',
      'all': 'All time'
    };
    return labels[this.dateRange] || this.dateRange;
  }

  getPenNameLabel(): string {
    const labels: Record<string, string> = {
      'pen1': 'Romance Author',
      'pen2': 'Thriller Writer',
      'pen3': 'Fantasy Sage'
    };
    return labels[this.penName] || this.penName;
  }

  getPlatformLabel(): string {
    const labels: Record<string, string> = {
      'amazon': 'Amazon',
      'kobo': 'Kobo',
      'apple': 'Apple Books',
      'google': 'Google Play',
      'bn': 'Barnes & Noble'
    };
    return labels[this.platform] || this.platform;
  }

  getFormatLabel(): string {
    const labels: Record<string, string> = {
      'ebook': 'Ebook',
      'paperback': 'Paperback',
      'hardcover': 'Hardcover',
      'audio': 'Audiobook'
    };
    return labels[this.format] || this.format;
  }

  getDistributionLabel(): string {
    const labels: Record<string, string> = {
      'ku': 'Kindle Unlimited',
      'wide': 'Wide'
    };
    return labels[this.distribution] || this.distribution;
  }
}
