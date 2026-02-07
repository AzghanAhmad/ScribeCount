import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="action-toolbar">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .action-toolbar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
  `]
})
export class ActionToolbarComponent {}
