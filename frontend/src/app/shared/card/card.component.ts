import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.print-friendly]="printFriendly">
      <div *ngIf="title || actions" class="card-header">
        <h3 *ngIf="title" class="card-title">{{ title }}</h3>
        <div *ngIf="actions" class="card-actions">
          <ng-content select="[card-actions]"></ng-content>
        </div>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: var(--background-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .card.print-friendly {
      break-inside: avoid;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border-color);
      background: var(--background);
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .card-body {
      padding: 1.25rem;
    }
  `]
})
export class CardComponent {
  @Input() title?: string;
  @Input() printFriendly = false;
  @Input() actions = false;
}
