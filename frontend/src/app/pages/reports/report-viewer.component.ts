import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from '../../shared/card/card.component';
import { DataTableComponent, DataTableColumn } from '../../shared/data-table/data-table.component';
import { TrendIndicatorComponent } from '../../shared/trend-indicator/trend-indicator.component';
import { ActionToolbarComponent } from '../../shared/action-toolbar/action-toolbar.component';

@Component({
  selector: 'app-report-viewer',
  standalone: true,
  imports: [CommonModule, CardComponent, DataTableComponent, TrendIndicatorComponent, ActionToolbarComponent],
  template: `
    <div class="page report-viewer">
      <div class="report-actions-bar">
        <app-action-toolbar>
          <button type="button" class="btn btn-primary" (click)="print()">Print</button>
          <button type="button" class="btn btn-secondary">Email</button>
          <button type="button" class="btn btn-secondary">Export PDF</button>
        </app-action-toolbar>
      </div>

      <app-card title="Executive Summary" [printFriendly]="true">
        <p class="summary-text">
          This report summarizes royalty performance for the selected period. Key metrics show a 12% increase
          in KDP Select earnings and a 5% increase in wide distribution. Overall revenue is up 8% period-over-period.
        </p>
      </app-card>

      <app-card title="Metrics Table" [printFriendly]="true">
        <app-data-table [columns]="metricsColumns" [data]="metricsData"></app-data-table>
      </app-card>

      <div class="comparison-blocks">
        <app-card title="Period Comparison" [printFriendly]="true">
          <div class="comparison-placeholder">
            <app-trend-indicator direction="up" label="Current period vs previous: +8%"></app-trend-indicator>
          </div>
        </app-card>
        <app-card title="Trend Indicators" [printFriendly]="true">
          <div class="trends-inline">
            <app-trend-indicator direction="up" label="Ebooks ↑"></app-trend-indicator>
            <app-trend-indicator direction="down" label="Audio ↓"></app-trend-indicator>
            <app-trend-indicator direction="neutral" label="Print →"></app-trend-indicator>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    .page.report-viewer {
      max-width: 1000px;
    }

    .report-actions-bar {
      margin-bottom: 1.5rem;
    }

    .summary-text {
      font-size: 0.9375rem;
      line-height: 1.6;
      color: var(--text-primary);
      margin: 0;
    }

    .comparison-blocks {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .comparison-placeholder,
    .trends-inline {
      padding: 0.5rem 0;
    }

    .trends-inline {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid var(--border-color);
      background: white;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .btn-secondary:hover {
      background: var(--primary-bg);
    }

    @media print {
      .report-actions-bar { display: none; }
    }
  `]
})
export class ReportViewerComponent {
  metricsColumns: DataTableColumn[] = [
    { key: 'metric', label: 'Metric' },
    { key: 'value', label: 'Value', type: 'currency' },
    { key: 'trend', label: 'Trend', type: 'trend' }
  ];
  metricsData: Record<string, unknown>[] = [
    { metric: 'Total Royalties', value: 4520.50, trend: 'up' },
    { metric: 'KDP Select', value: 2800.00, trend: 'up' },
    { metric: 'Wide', value: 1720.50, trend: 'neutral' }
  ];

  constructor(private route: ActivatedRoute) {}

  print(): void {
    window.print();
  }
}
