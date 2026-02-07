import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trend-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="trend" [ngClass]="direction">
      <span class="icon">{{ icon }}</span>
      <span *ngIf="label" class="label">{{ label }}</span>
    </span>
  `,
  styles: [`
    .trend {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .trend.up { color: var(--trend-up); }
    .trend.down { color: var(--trend-down); }
    .trend.neutral { color: var(--trend-neutral); }

    .icon {
      font-weight: 700;
    }
  `]
})
export class TrendIndicatorComponent {
  @Input() direction: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() label?: string;

  get icon(): string {
    return this.direction === 'up' ? '↑' : this.direction === 'down' ? '↓' : '→';
  }
}
