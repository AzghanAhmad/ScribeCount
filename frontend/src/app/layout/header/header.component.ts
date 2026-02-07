import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbService, BreadcrumbItem } from '../../core/breadcrumb.service';
import { AssistantService } from '../../assistant/assistant.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="header">
      <div class="header-content">
        <!-- Logo Section -->
        <a routerLink="/" class="logo-section">
          <div class="logo-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#60a5fa"/>
                  <stop offset="100%" stop-color="#a78bfa"/>
                </linearGradient>
              </defs>
              <rect x="2" y="4" width="28" height="24" rx="4" fill="url(#logoGradient)" opacity="0.2"/>
              <path d="M8 12h16M8 16h12M8 20h8" stroke="url(#logoGradient)" stroke-width="2" stroke-linecap="round"/>
              <circle cx="24" cy="20" r="4" fill="url(#logoGradient)"/>
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-name">ScribeCount</span>
            <span class="logo-badge">Intelligence</span>
          </div>
        </a>

        <!-- Center Section - Search & Global Actions -->
        <div class="header-center">
          <button type="button" class="global-search" (click)="openSearch()">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span class="search-placeholder">Search anything...</span>
            <kbd class="search-shortcut">⌘K</kbd>
          </button>
        </div>

        <!-- Right Actions -->
        <div class="header-actions">
          <!-- Hey ScribeCount Button - Premium Style -->
          <button
            type="button"
            class="hey-scribecount-btn"
            (click)="openAssistant()"
            aria-label="Hey ScribeCount?"
          >
            <span class="btn-glow"></span>
            <svg class="sparkle-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/>
            </svg>
            <span>Hey ScribeCount?</span>
          </button>

          <!-- Notifications -->
          <button type="button" class="icon-btn" aria-label="Notifications" [class.has-badge]="notificationCount > 0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="notification-badge" *ngIf="notificationCount > 0">{{ notificationCount }}</span>
          </button>

          <!-- Quick Actions -->
          <button type="button" class="icon-btn" aria-label="Quick actions">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </button>

          <!-- User Menu -->
          <div class="user-menu-wrapper">
            <button
              type="button"
              class="user-menu-trigger"
              (click)="toggleUserMenu()"
              [attr.aria-expanded]="userMenuOpen"
              aria-haspopup="true"
              aria-label="User menu"
            >
              <div class="user-avatar">
                <span class="avatar-text">SC</span>
                <span class="status-indicator"></span>
              </div>
            </button>

            <div class="user-dropdown" [class.open]="userMenuOpen" role="menu">
              <div class="dropdown-header">
                <div class="user-info">
                  <div class="user-avatar-lg">SC</div>
                  <div class="user-details">
                    <span class="user-name">ScribeCount User</span>
                    <span class="user-email">user&#64;scribecount.com</span>
                  </div>
                </div>
              </div>
              
              <div class="dropdown-section">
                <a class="dropdown-item" (click)="closeUserMenu()" routerLink="/settings" role="menuitem">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Account Settings
                </a>
                <a class="dropdown-item" (click)="closeUserMenu()" href="#" role="menuitem">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                  Preferences
                </a>
                <a class="dropdown-item" (click)="closeUserMenu()" href="#" role="menuitem">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Security
                </a>
              </div>
              
              <div class="dropdown-section">
                <a class="dropdown-item" (click)="closeUserMenu()" href="#" role="menuitem">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Help & Support
                </a>
                <a class="dropdown-item" (click)="closeUserMenu()" href="#" role="menuitem">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  Documentation
                </a>
              </div>
              
              <div class="dropdown-footer">
                <button type="button" class="dropdown-item logout" (click)="logout(); closeUserMenu()" role="menuitem">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          </div>
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
      background: linear-gradient(135deg, rgb(28, 46, 74) 0%, rgb(20, 33, 52) 100%);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 1.5rem;
      gap: 1.5rem;
    }

    /* Logo Section */
    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    .logo-section:hover {
      transform: scale(1.02);
    }

    .logo-icon {
      width: 36px;
      height: 36px;
    }

    .logo-icon svg {
      width: 100%;
      height: 100%;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .logo-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      letter-spacing: -0.5px;
    }

    .logo-badge {
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.5);
    }

    /* Header Center - Search */
    .header-center {
      flex: 1;
      max-width: 480px;
      margin: 0 auto;
    }

    .global-search {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .global-search:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .search-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .search-placeholder {
      flex: 1;
      text-align: left;
    }

    .search-shortcut {
      padding: 0.25rem 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      font-size: 0.75rem;
      font-family: inherit;
      color: rgba(255, 255, 255, 0.5);
    }

    /* Header Actions */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    /* Hey ScribeCount Button */
    .hey-scribecount-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    }

    .hey-scribecount-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(99, 102, 241, 0.4);
    }

    .hey-scribecount-btn .btn-glow {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s ease;
    }

    .hey-scribecount-btn:hover .btn-glow {
      transform: translateX(100%);
    }

    .sparkle-icon {
      width: 16px;
      height: 16px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }

    /* Icon Buttons */
    .icon-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      transform: translateY(-1px);
    }

    .icon-btn svg {
      width: 20px;
      height: 20px;
    }

    .icon-btn.has-badge::after {
      content: '';
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid rgb(28, 46, 74);
    }

    .notification-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      font-size: 0.6875rem;
      font-weight: 600;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
    }

    /* User Menu */
    .user-menu-wrapper {
      position: relative;
      margin-left: 0.5rem;
    }

    .user-menu-trigger {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .user-menu-trigger:hover {
      transform: scale(1.05);
    }

    .user-avatar {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      border-radius: 12px;
      color: white;
      font-weight: 700;
      font-size: 0.875rem;
      box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
    }

    .status-indicator {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      background: #10b981;
      border: 2px solid rgb(28, 46, 74);
      border-radius: 50%;
    }

    /* User Dropdown */
    .user-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      width: 280px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px) scale(0.95);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1100;
      overflow: hidden;
    }

    .user-dropdown.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .dropdown-header {
      padding: 1.25rem;
      background: linear-gradient(135deg, rgba(28, 46, 74, 0.03) 0%, rgba(99, 102, 241, 0.05) 100%);
      border-bottom: 1px solid var(--border-light);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.875rem;
    }

    .user-avatar-lg {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      border-radius: 14px;
      color: white;
      font-weight: 700;
      font-size: 1.125rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.9375rem;
    }

    .user-email {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .dropdown-section {
      padding: 0.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .dropdown-section:last-of-type {
      border-bottom: none;
    }

    .dropdown-footer {
      padding: 0.5rem;
      background: var(--background-subtle);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.625rem 0.875rem;
      text-align: left;
      border: none;
      background: none;
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      border-radius: 10px;
      transition: all 0.15s ease;
    }

    .dropdown-item svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .dropdown-item:hover {
      background: var(--primary-light);
      color: var(--primary);
    }

    .dropdown-item.logout {
      color: var(--error);
    }

    .dropdown-item.logout:hover {
      background: rgba(239, 68, 68, 0.08);
      color: var(--error);
    }
  `]
})
export class HeaderComponent implements OnInit {
  breadcrumbItems: BreadcrumbItem[] = [];
  userMenuOpen = false;
  notificationCount = 3;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private assistantService: AssistantService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs.subscribe(items => {
      this.breadcrumbItems = items;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) {
      this.userMenuOpen = false;
    }
  }

  openSearch(): void {
    // TODO: Implement global search modal
  }

  openAssistant(): void {
    this.assistantService.openPanel();
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  logout(): void {
    // Placeholder for backend wiring
  }
}
