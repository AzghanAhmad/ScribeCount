import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DataTableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'currency' | 'trend';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th *ngFor="let col of columns" [class.numeric]="col.type === 'number' || col.type === 'currency'">
              {{ col.label }}
            </th>
            <th *ngIf="hasActions" class="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data; let i = index">
            <td *ngFor="let col of columns" [class.numeric]="col.type === 'number' || col.type === 'currency'">
              <span *ngIf="col.type === 'trend'" class="trend" [ngClass]="getTrendClass(row[col.key])">
                {{ getTrendIcon(row[col.key]) }} {{ row[col.key] }}
              </span>
              <span *ngIf="col.type === 'currency'">{{ getCellNumber(row[col.key]) }}</span>
              <span *ngIf="col.type === 'date'">{{ getCellDate(row[col.key]) }}</span>
              <span *ngIf="!col.type || col.type === 'text' || col.type === 'number'">{{ row[col.key] }}</span>
            </td>
            <td *ngIf="hasActions" class="actions-col">
              <ng-content select="[row-actions]"></ng-content>
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="!data || data.length === 0" class="empty-state">No data</div>
    </div>
  `,
  styles: [`
    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    .data-table th,
    .data-table td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    .data-table th {
      font-weight: 600;
      color: var(--text-secondary);
      background: var(--background);
    }

    .data-table td.numeric,
    .data-table th.numeric {
      text-align: right;
    }

    .data-table tbody tr:hover {
      background: var(--primary-bg);
    }

    .actions-col {
      white-space: nowrap;
    }

    .trend.up { color: var(--trend-up); }
    .trend.down { color: var(--trend-down); }
    .trend.neutral { color: var(--trend-neutral); }

    .empty-state {
      padding: 2rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.875rem;
    }
  `]
})
export class DataTableComponent {
  @Input() columns: DataTableColumn[] = [];
  @Input() data: Record<string, unknown>[] = [];
  @Input() hasActions = false;

  getTrendIcon(value: unknown): string {
    if (value === 'up' || value === '↑') return '↑';
    if (value === 'down' || value === '↓') return '↓';
    return '→';
  }

  getTrendClass(value: unknown): string {
    if (value === 'up' || value === '↑') return 'up';
    if (value === 'down' || value === '↓') return 'down';
    return 'neutral';
  }

  getCellNumber(value: unknown): string {
    if (value == null) return '—';
    const n = typeof value === 'number' ? value : Number(value);
    return isNaN(n) ? String(value) : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  getCellDate(value: unknown): string {
    if (value == null) return '—';
    const d = value instanceof Date ? value : new Date(value as string | number);
    return isNaN(d.getTime()) ? String(value) : d.toLocaleString();
  }
}
