import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="home">
      <h1>Welcome to ScribeCount</h1>
      <p>Your intelligent analytics platform</p>
    </div>
  `,
  styles: [`
    .home {
      max-width: 1200px;
    }

    h1 {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #1a202c;
    }

    p {
      font-size: 1.125rem;
      color: #718096;
    }
  `]
})
export class HomeComponent {}
