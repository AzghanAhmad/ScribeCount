import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="logo">ScribeCount</h1>
        </div>
        <div class="header-actions">
          <button class="user-menu">
            <span class="user-avatar">SC</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: rgb(28, 46, 74);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 1.5rem;
    }

    .logo-section {
      display: flex;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-menu {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      padding: 0;
      cursor: pointer;
      border-radius: 50%;
      transition: background 0.2s;
    }

    .user-menu:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
    }
  `]
})
export class HeaderComponent {}
