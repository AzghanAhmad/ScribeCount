import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { SmartLinkService } from '../../services/smart-link.service';
import { AnalyticsData } from '../../models/smart-link.model';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">Click Analytics</h1>
          <p class="page-subtitle">Detailed performance data for your smart link</p>
        </div>
        <div class="header-actions">
          <div class="period-tabs">
            <button class="period-tab" [class.active]="period === '7d'" (click)="setPeriod('7d')">7 Days</button>
            <button class="period-tab" [class.active]="period === '30d'" (click)="setPeriod('30d')">30 Days</button>
            <button class="period-tab" [class.active]="period === '90d'" (click)="setPeriod('90d')">90 Days</button>
          </div>
          <button class="btn-export" (click)="exportData()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
        </div>
      </div>

      <!-- Stat Summary -->
      <div class="stats-row">
        <div class="mini-stat">
          <span class="mini-stat-value">{{ data.totalClicks | number }}</span>
          <span class="mini-stat-label">Total Clicks</span>
        </div>
        <div class="mini-stat">
          <span class="mini-stat-value">{{ data.countries.length }}</span>
          <span class="mini-stat-label">Countries</span>
        </div>
        <div class="mini-stat">
          <span class="mini-stat-value">{{ data.retailers.length }}</span>
          <span class="mini-stat-label">Retailers</span>
        </div>
        <div class="mini-stat">
          <span class="mini-stat-value">{{ data.campaigns.length }}</span>
          <span class="mini-stat-label">Campaigns</span>
        </div>
      </div>

      <!-- Clicks Over Time -->
      <div class="chart-card animate-fade-in-up" style="animation-delay:0.1s">
        <h3 class="chart-title">Clicks Over Time</h3>
        <div class="chart-container large">
          <canvas #clicksChart></canvas>
        </div>
      </div>

      <!-- Two column chart row -->
      <div class="charts-row">
        <div class="chart-card animate-fade-in-up" style="animation-delay:0.15s">
          <h3 class="chart-title">Clicks by Country</h3>
          <div class="chart-container">
            <canvas #countryChart></canvas>
          </div>
        </div>
        <div class="chart-card animate-fade-in-up" style="animation-delay:0.2s">
          <h3 class="chart-title">Clicks by Retailer</h3>
          <div class="chart-container">
            <canvas #retailerChart></canvas>
          </div>
        </div>
      </div>

      <!-- Device + Campaign row -->
      <div class="charts-row">
        <div class="chart-card animate-fade-in-up" style="animation-delay:0.25s">
          <h3 class="chart-title">Clicks by Device</h3>
          <div class="chart-container">
            <canvas #deviceChart></canvas>
          </div>
        </div>
        <div class="chart-card wide animate-fade-in-up" style="animation-delay:0.3s">
          <h3 class="chart-title">Campaign Performance</h3>
          <div class="campaign-table">
            <div class="campaign-header">
              <span>Source</span>
              <span>Campaign</span>
              <span>Country</span>
              <span>Retailer</span>
              <span>Clicks</span>
            </div>
            <div class="campaign-row" *ngFor="let c of data.campaigns">
              <span class="campaign-source">
                <span class="source-dot" [style.background]="getSourceColor(c.source)"></span>
                {{ c.source }}
              </span>
              <span class="campaign-name">{{ c.campaign }}</span>
              <span>{{ c.country }}</span>
              <span>{{ c.retailer }}</span>
              <span class="campaign-clicks">{{ c.clicks | number }}</span>
            </div>
          </div>
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
      gap: 1rem;
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
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .period-tabs {
      display: flex;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      overflow: hidden;
    }

    .period-tab {
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
      font-weight: 500;
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }

    .period-tab.active {
      background: rgb(28, 46, 74);
      color: white;
    }

    .btn-export {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-export svg { width: 16px; height: 16px; }

    .btn-export:hover {
      border-color: var(--accent-blue);
      color: var(--accent-blue);
    }

    /* Stats Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .mini-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.25rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }

    .mini-stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .mini-stat-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Chart Cards */
    .chart-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      margin-bottom: 1.5rem;
      opacity: 0;
      animation: fadeInUp 0.5s ease-out forwards;
    }

    .chart-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 1rem 0;
    }

    .chart-container {
      height: 280px;
      position: relative;
    }

    .chart-container.large {
      height: 300px;
    }

    .charts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .chart-card.wide {
      grid-column: 1 / -1;
    }

    /* Campaign Table */
    .campaign-table {
      display: flex;
      flex-direction: column;
    }

    .campaign-header, .campaign-row {
      display: grid;
      grid-template-columns: 1fr 1.5fr 0.8fr 1fr 0.8fr;
      gap: 1rem;
      padding: 0.75rem 1rem;
      font-size: 0.8125rem;
      align-items: center;
    }

    .campaign-header {
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.6875rem;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-light);
    }

    .campaign-row {
      border-bottom: 1px solid var(--border-light);
      transition: background 0.2s;
    }

    .campaign-row:last-child { border-bottom: none; }

    .campaign-row:hover {
      background: rgba(59, 130, 246, 0.03);
    }

    .campaign-source {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .source-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .campaign-name {
      color: var(--accent-blue);
      font-weight: 500;
    }

    .campaign-clicks {
      font-weight: 600;
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .charts-row { grid-template-columns: 1fr; }
      .stats-row { grid-template-columns: repeat(2, 1fr); }
      .page-header { flex-direction: column; }
      .campaign-header, .campaign-row { grid-template-columns: 1fr 1fr 1fr; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in-up {
      opacity: 0;
      animation: fadeInUp 0.5s ease-out forwards;
    }
  `]
})
export class AnalyticsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('clicksChart') clicksChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('countryChart') countryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('retailerChart') retailerChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('deviceChart') deviceChartRef!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];
  period = '30d';
  data: AnalyticsData;

  constructor(private route: ActivatedRoute, private smartLinkService: SmartLinkService) {
    const id = this.route.snapshot.paramMap.get('id') || '1';
    this.data = this.smartLinkService.getAnalytics(id);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initCharts(), 100);
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
  }

  setPeriod(p: string) {
    this.period = p;
  }

  getSourceColor(source: string): string {
    const colors: Record<string, string> = {
      'Facebook': '#3b82f6',
      'Instagram': '#e1306c',
      'Email': '#14b8a6',
      'TikTok': '#010101',
      'Blog': '#8b5cf6'
    };
    return colors[source] || '#64748b';
  }

  exportData(): void {
    const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private initCharts(): void {
    this.createClicksChart();
    this.createCountryChart();
    this.createRetailerChart();
    this.createDeviceChart();
  }

  private createClicksChart(): void {
    const ctx = this.clicksChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)');

    this.charts.push(new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.data.clicksByDay.map(d => {
          const date = new Date(d.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [{
          label: 'Clicks',
          data: this.data.clicksByDay.map(d => d.clicks),
          borderColor: '#3b82f6',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#3b82f6',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
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
            ticks: { color: '#94a3b8', maxTicksLimit: 10, font: { size: 11 } }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { color: '#94a3b8', font: { size: 11 } }
          }
        },
        interaction: { intersect: false, mode: 'index' }
      }
    }));
  }

  private createCountryChart(): void {
    const ctx = this.countryChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.charts.push(new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.data.countries.map(c => c.country),
        datasets: [{
          data: this.data.countries.map(c => c.clicks),
          backgroundColor: ['#3b82f6', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#64748b'],
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.95)', padding: 12, cornerRadius: 8 }
        },
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8' } },
          y: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } }
        }
      }
    }));
  }

  private createRetailerChart(): void {
    const ctx = this.retailerChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.charts.push(new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.data.retailers.map(r => r.retailer),
        datasets: [{
          data: this.data.retailers.map(r => r.clicks),
          backgroundColor: ['#3b82f6', '#8b5cf6', '#14b8a6', '#f59e0b', '#64748b'],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { size: 11 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => `${ctx.label}: ${(ctx.parsed as number).toLocaleString()} clicks`
            }
          }
        }
      }
    }));
  }

  private createDeviceChart(): void {
    const ctx = this.deviceChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.charts.push(new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.data.devices.map(d => d.device),
        datasets: [{
          data: this.data.devices.map(d => d.clicks),
          backgroundColor: ['#3b82f6', '#8b5cf6', '#14b8a6'],
          borderRadius: 10,
          borderSkipped: false,
          barThickness: 48
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.95)', padding: 12, cornerRadius: 8 }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#64748b' } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8' } }
        }
      }
    }));
  }
}
