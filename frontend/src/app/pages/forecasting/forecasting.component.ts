import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface ForecastMetric {
  label: string;
  current: string;
  forecast: string;
  change: number;
  confidence: number;
}

@Component({
  selector: 'app-forecasting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">Forecasting</h1>
          <p class="page-subtitle">AI-powered predictions for your royalties and sales</p>
        </div>
        <div class="header-actions">
          <select class="period-select" [(ngModel)]="forecastPeriod">
            <option value="30">Next 30 Days</option>
            <option value="60">Next 60 Days</option>
            <option value="90">Next 90 Days</option>
            <option value="180">Next 6 Months</option>
          </select>
          <button class="btn btn-primary">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Refresh Forecast
          </button>
        </div>
      </div>

      <!-- AI Confidence Banner -->
      <div class="confidence-banner animate-fade-in-up">
        <div class="ai-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="banner-content">
          <span class="banner-title">AI Forecast Model</span>
          <span class="banner-text">Based on 18 months of historical data, seasonal patterns, and current trends</span>
        </div>
        <div class="confidence-score">
          <span class="score-label">Model Confidence</span>
          <div class="score-bar">
            <div class="score-fill" [style.width]="modelConfidence + '%'"></div>
          </div>
          <span class="score-value">{{ modelConfidence }}%</span>
        </div>
      </div>

      <!-- Forecast Summary Cards -->
      <div class="forecast-cards animate-fade-in-up" style="animation-delay: 0.1s">
        <div *ngFor="let metric of forecastMetrics; let i = index" 
             class="forecast-card"
             [class.highlight]="i === 0">
          <div class="card-header">
            <span class="metric-label">{{ metric.label }}</span>
            <div class="confidence-badge" [class]="getConfidenceClass(metric.confidence)">
              {{ metric.confidence }}% confidence
            </div>
          </div>
          <div class="card-values">
            <div class="current-value">
              <span class="value-label">Current</span>
              <span class="value">{{ metric.current }}</span>
            </div>
            <div class="arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
            <div class="forecast-value">
              <span class="value-label">Forecast</span>
              <span class="value">{{ metric.forecast }}</span>
            </div>
          </div>
          <div class="card-change" [class]="metric.change >= 0 ? 'positive' : 'negative'">
            <svg *ngIf="metric.change >= 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            <svg *ngIf="metric.change < 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ metric.change >= 0 ? '+' : '' }}{{ metric.change }}% projected
          </div>
        </div>
      </div>

      <!-- Main Forecast Chart -->
      <div class="chart-card animate-fade-in-up" style="animation-delay: 0.2s">
        <div class="chart-header">
          <div class="chart-title-group">
            <h3 class="chart-title">Revenue Forecast</h3>
            <p class="chart-subtitle">Historical data with AI predictions</p>
          </div>
          <div class="chart-legend">
            <span class="legend-item">
              <span class="legend-line solid"></span>
              Historical
            </span>
            <span class="legend-item">
              <span class="legend-line dashed"></span>
              Forecast
            </span>
            <span class="legend-item">
              <span class="legend-area"></span>
              Confidence Range
            </span>
          </div>
        </div>
        <div class="chart-container large">
          <canvas #forecastChart></canvas>
        </div>
      </div>

      <!-- Breakdown Section -->
      <div class="breakdown-grid">
        <!-- Platform Forecast -->
        <div class="chart-card animate-fade-in-up" style="animation-delay: 0.3s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Platform Forecast</h3>
              <p class="chart-subtitle">Predicted revenue by platform</p>
            </div>
          </div>
          <div class="chart-container">
            <canvas #platformForecast></canvas>
          </div>
        </div>

        <!-- Seasonal Patterns -->
        <div class="chart-card animate-fade-in-up" style="animation-delay: 0.35s">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">Seasonal Patterns</h3>
              <p class="chart-subtitle">Historical seasonality in your sales</p>
            </div>
          </div>
          <div class="chart-container">
            <canvas #seasonalChart></canvas>
          </div>
        </div>
      </div>

      <!-- Insights Section -->
      <div class="insights-grid animate-fade-in-up" style="animation-delay: 0.4s">
        <div class="insights-card">
          <h3 class="insights-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            Key Insights
          </h3>
          <ul class="insights-list">
            <li *ngFor="let insight of insights" class="insight-item">
              <span class="insight-icon" [class]="insight.type">
                <svg *ngIf="insight.type === 'positive'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <svg *ngIf="insight.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <svg *ngIf="insight.type === 'info'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </span>
              <span class="insight-text">{{ insight.text }}</span>
            </li>
          </ul>
        </div>

        <div class="actions-card">
          <h3 class="actions-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            Recommended Actions
          </h3>
          <div class="actions-list">
            <button *ngFor="let action of recommendedActions" class="action-item">
              <span class="action-priority" [class]="action.priority">{{ action.priority }}</span>
              <div class="action-content">
                <span class="action-title">{{ action.title }}</span>
                <span class="action-description">{{ action.description }}</span>
              </div>
              <svg class="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
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
      align-items: center;
    }

    .period-select {
      padding: 0.625rem 2.5rem 0.625rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      font-size: 0.875rem;
      background: white;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
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
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
    }

    /* Confidence Banner */
    .confidence-banner {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem 1.5rem;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 14px;
      margin-bottom: 1.5rem;
    }

    .ai-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      border-radius: 12px;
      color: white;
    }

    .ai-icon svg {
      width: 24px;
      height: 24px;
    }

    .banner-content {
      flex: 1;
    }

    .banner-title {
      display: block;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .banner-text {
      display: block;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .confidence-score {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .score-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .score-bar {
      width: 100px;
      height: 8px;
      background: rgba(139, 92, 246, 0.2);
      border-radius: 4px;
      overflow: hidden;
    }

    .score-fill {
      height: 100%;
      background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%);
      border-radius: 4px;
      transition: width 0.5s ease;
    }

    .score-value {
      font-size: 1rem;
      font-weight: 700;
      color: var(--accent-purple);
    }

    /* Forecast Cards */
    .forecast-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 1200px) {
      .forecast-cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .forecast-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 14px;
      padding: 1.25rem;
      transition: all 0.3s ease;
    }

    .forecast-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    }

    .forecast-card.highlight {
      background: linear-gradient(135deg, rgb(28, 46, 74) 0%, rgb(45, 75, 120) 100%);
      border: none;
      color: white;
    }

    .forecast-card.highlight .metric-label,
    .forecast-card.highlight .value-label {
      color: rgba(255, 255, 255, 0.7);
    }

    .forecast-card.highlight .value {
      color: white;
    }

    .forecast-card.highlight .confidence-badge {
      background: rgba(255, 255, 255, 0.15);
      color: white;
    }

    .forecast-card.highlight .card-change.positive {
      color: #6ee7b7;
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .metric-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-muted);
    }

    .confidence-badge {
      font-size: 0.6875rem;
      font-weight: 500;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
    }

    .confidence-badge.high {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .confidence-badge.medium {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .confidence-badge.low {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }

    .card-values {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .current-value,
    .forecast-value {
      flex: 1;
    }

    .value-label {
      display: block;
      font-size: 0.6875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.125rem;
    }

    .value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .arrow {
      color: var(--text-muted);
    }

    .arrow svg {
      width: 20px;
      height: 20px;
    }

    .card-change {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8125rem;
      font-weight: 500;
    }

    .card-change.positive {
      color: var(--success);
    }

    .card-change.negative {
      color: var(--error);
    }

    .card-change svg {
      width: 16px;
      height: 16px;
    }

    /* Chart Cards */
    .chart-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      margin-bottom: 1.5rem;
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

    .chart-legend {
      display: flex;
      gap: 1.25rem;
    }

    .chart-legend .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .legend-line {
      width: 20px;
      height: 2px;
    }

    .legend-line.solid {
      background: #3b82f6;
    }

    .legend-line.dashed {
      background: repeating-linear-gradient(90deg, #8b5cf6, #8b5cf6 4px, transparent 4px, transparent 8px);
    }

    .legend-area {
      width: 16px;
      height: 12px;
      background: rgba(139, 92, 246, 0.2);
      border-radius: 2px;
    }

    .chart-container {
      height: 280px;
      position: relative;
    }

    .chart-container.large {
      height: 360px;
    }

    /* Breakdown Grid */
    .breakdown-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .breakdown-grid .chart-card {
      margin-bottom: 0;
    }

    @media (max-width: 1024px) {
      .breakdown-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Insights Grid */
    .insights-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 1024px) {
      .insights-grid {
        grid-template-columns: 1fr;
      }
    }

    .insights-card,
    .actions-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
    }

    .insights-title,
    .actions-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 1.25rem 0;
    }

    .insights-title svg,
    .actions-title svg {
      width: 20px;
      height: 20px;
      color: var(--accent-purple);
    }

    .insights-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .insight-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.875rem;
      background: var(--background);
      border-radius: 10px;
    }

    .insight-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .insight-icon svg {
      width: 14px;
      height: 14px;
    }

    .insight-icon.positive {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .insight-icon.warning {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .insight-icon.info {
      background: rgba(59, 130, 246, 0.1);
      color: var(--info);
    }

    .insight-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .actions-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .action-item {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0.875rem;
      background: var(--background);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
    }

    .action-item:hover {
      background: var(--primary-light);
    }

    .action-priority {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .action-priority.high {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }

    .action-priority.medium {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .action-priority.low {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .action-content {
      flex: 1;
    }

    .action-title {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .action-description {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .action-arrow {
      width: 18px;
      height: 18px;
      color: var(--text-muted);
      opacity: 0;
      transition: all 0.2s;
    }

    .action-item:hover .action-arrow {
      opacity: 1;
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
export class ForecastingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('forecastChart') forecastChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('platformForecast') platformForecastRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('seasonalChart') seasonalChartRef!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];
  forecastPeriod = '30';
  modelConfidence = 87;

  forecastMetrics: ForecastMetric[] = [
    { label: 'Total Revenue', current: '$24,847', forecast: '$28,500', change: 14.7, confidence: 89 },
    { label: 'Books Sold', current: '3,247', forecast: '3,890', change: 19.8, confidence: 85 },
    { label: 'Page Reads (KU)', current: '847K', forecast: '920K', change: 8.6, confidence: 92 },
    { label: 'Avg. Order Value', current: '$7.65', forecast: '$7.32', change: -4.3, confidence: 78 }
  ];

  insights = [
    { type: 'positive', text: 'Revenue is projected to increase 14.7% based on holiday season patterns and recent marketing performance.' },
    { type: 'info', text: 'KU page reads typically spike 20-30% during January-February as readers catch up on their reading lists.' },
    { type: 'warning', text: 'Average order value may decrease due to promotional pricing strategy. Consider adjusting your sale schedule.' },
    { type: 'positive', text: 'Email-driven sales are forecasted to outperform other channels by 35% this period.' }
  ];

  recommendedActions = [
    { priority: 'high', title: 'Schedule BookBub Promo', description: 'High-impact opportunity detected in next 2 weeks' },
    { priority: 'medium', title: 'Increase Email Frequency', description: 'Your list engagement is above average' },
    { priority: 'low', title: 'Update Keywords', description: 'Refresh Amazon keywords for trending topics' }
  ];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }

  getConfidenceClass(confidence: number): string {
    if (confidence >= 85) return 'high';
    if (confidence >= 70) return 'medium';
    return 'low';
  }

  private initCharts(): void {
    this.createForecastChart();
    this.createPlatformForecast();
    this.createSeasonalChart();
  }

  private createForecastChart(): void {
    const ctx = this.forecastChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    // Historical data
    const historicalLabels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const historicalData = [18500, 19200, 21400, 22800, 23500, 24847];

    // Forecast data (continuing from Dec)
    const forecastLabels = ['Jan', 'Feb', 'Mar'];
    const forecastData = [26200, 27400, 28500];
    const forecastUpperBound = [27500, 29200, 31000];
    const forecastLowerBound = [24900, 25600, 26000];

    const allLabels = [...historicalLabels, ...forecastLabels];

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: allLabels,
        datasets: [
          {
            label: 'Historical',
            data: [...historicalData, null, null, null],
            borderColor: '#3b82f6',
            backgroundColor: 'transparent',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6'
          },
          {
            label: 'Forecast',
            data: [null, null, null, null, null, 24847, ...forecastData],
            borderColor: '#8b5cf6',
            backgroundColor: 'transparent',
            borderWidth: 3,
            borderDash: [5, 5],
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#8b5cf6'
          },
          {
            label: 'Upper Bound',
            data: [null, null, null, null, null, 24847, ...forecastUpperBound],
            borderColor: 'transparent',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            fill: '+1',
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: 'Lower Bound',
            data: [null, null, null, null, null, 24847, ...forecastLowerBound],
            borderColor: 'transparent',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.4,
            pointRadius: 0
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
              label: (ctx) => {
                if (ctx.parsed.y === null) return '';
                return `$${ctx.parsed.y.toLocaleString()}`;
              }
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

  private createPlatformForecast(): void {
    const ctx = this.platformForecastRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Amazon', 'Kobo', 'Apple', 'Google', 'B&N'],
        datasets: [
          {
            label: 'Current',
            data: [14500, 4200, 3100, 1800, 1247],
            backgroundColor: '#3b82f6',
            borderRadius: 4
          },
          {
            label: 'Forecast',
            data: [16800, 4800, 3600, 2100, 1200],
            backgroundColor: '#8b5cf6',
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

  private createSeasonalChart(): void {
    const ctx = this.seasonalChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Seasonal Index',
          data: [1.15, 1.08, 0.95, 0.88, 0.85, 0.82, 0.9, 0.92, 1.02, 1.08, 1.22, 1.35],
          borderColor: '#14b8a6',
          backgroundColor: 'rgba(20, 184, 166, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#14b8a6'
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
              label: (ctx) => {
                const value = ctx.parsed.y;
                if (value == null) return '';
                const percent = Math.round((value - 1) * 100);
                return `${percent >= 0 ? '+' : ''}${percent}% vs average`;
              }
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
            min: 0.7,
            max: 1.5,
            ticks: {
              color: '#64748b',
              callback: (value) => {
                const percent = Math.round((Number(value) - 1) * 100);
                return `${percent >= 0 ? '+' : ''}${percent}%`;
              }
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }
}
