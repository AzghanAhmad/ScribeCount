import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Configure your smart link platform preferences</p>
      </div>

      <div class="settings-layout">
        <!-- Settings Navigation -->
        <nav class="settings-nav">
          <button *ngFor="let section of sections"
                  class="nav-item"
                  [class.active]="activeSection === section.id"
                  (click)="activeSection = section.id">
            <div class="nav-icon" [innerHTML]="section.icon"></div>
            {{ section.label }}
          </button>
        </nav>

        <!-- Settings Content -->
        <div class="settings-content">
          <!-- Default Routing -->
          <div class="settings-section" *ngIf="activeSection === 'routing'">
            <div class="card">
              <h2 class="section-title">Default Routing Behavior</h2>
              <p class="section-desc">Set how your links behave by default</p>

              <div class="form-group">
                <label class="form-label">Default Fallback Country</label>
                <select class="form-input" [(ngModel)]="defaultCountry">
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Default Format Preference</label>
                <select class="form-input" [(ngModel)]="defaultFormat">
                  <option value="ebook">Ebook</option>
                  <option value="paperback">Paperback</option>
                  <option value="audiobook">Audiobook</option>
                  <option value="auto">Auto-detect</option>
                </select>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-label">Enable Bridge Page</span>
                  <span class="setting-desc">Show a brief interstitial before redirecting to retailer</span>
                </div>
                <input type="checkbox" class="toggle" [(ngModel)]="enableBridgePage">
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-label">Auto Geo-Routing</span>
                  <span class="setting-desc">Automatically detect country and route to correct store</span>
                </div>
                <input type="checkbox" class="toggle" [(ngModel)]="autoGeoRouting">
              </div>
            </div>
          </div>

          <!-- Account -->
          <div class="settings-section" *ngIf="activeSection === 'account'">
            <div class="card">
              <h2 class="section-title">Account Information</h2>
              <div class="form-group">
                <label class="form-label">Display Name</label>
                <input type="text" class="form-input" [(ngModel)]="accountName">
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" [(ngModel)]="accountEmail">
              </div>
              <div class="form-group">
                <label class="form-label">Author/Brand Name</label>
                <input type="text" class="form-input" [(ngModel)]="authorName">
              </div>
              <button class="btn-primary" style="margin-top: 0.75rem;">Save Changes</button>
            </div>

            <div class="card">
              <h2 class="section-title">Security</h2>
              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-label">Two-Factor Authentication</span>
                  <span class="setting-desc">Add an extra layer of security to your account</span>
                </div>
                <input type="checkbox" class="toggle" [(ngModel)]="twoFactorEnabled">
              </div>
              <button class="btn-secondary" style="margin-top: 0.75rem;">Change Password</button>
            </div>
          </div>

          <!-- Notifications -->
          <div class="settings-section" *ngIf="activeSection === 'notifications'">
            <div class="card">
              <h2 class="section-title">Email Notifications</h2>
              <div class="setting-item" *ngFor="let notif of emailNotifications">
                <div class="setting-info">
                  <span class="setting-label">{{ notif.title }}</span>
                  <span class="setting-desc">{{ notif.description }}</span>
                </div>
                <input type="checkbox" class="toggle" [(ngModel)]="notif.enabled">
              </div>
            </div>
          </div>

          <!-- Appearance -->
          <div class="settings-section" *ngIf="activeSection === 'appearance'">
            <div class="card">
              <h2 class="section-title">Theme</h2>
              <div class="theme-options">
                <div class="theme-option" [class.active]="theme === 'light'" (click)="theme = 'light'">
                  <div class="theme-preview light">
                    <div class="preview-header"></div>
                    <div class="preview-sidebar"></div>
                    <div class="preview-content"></div>
                  </div>
                  <span class="theme-label">Light</span>
                </div>
                <div class="theme-option" [class.active]="theme === 'dark'" (click)="theme = 'dark'">
                  <div class="theme-preview dark">
                    <div class="preview-header"></div>
                    <div class="preview-sidebar"></div>
                    <div class="preview-content"></div>
                  </div>
                  <span class="theme-label">Dark</span>
                </div>
                <div class="theme-option" [class.active]="theme === 'auto'" (click)="theme = 'auto'">
                  <div class="theme-preview auto">
                    <div class="preview-header"></div>
                    <div class="preview-sidebar"></div>
                    <div class="preview-content"></div>
                  </div>
                  <span class="theme-label">Auto</span>
                </div>
              </div>
            </div>

            <div class="card">
              <h2 class="section-title">Dashboard Preferences</h2>
              <div class="form-group">
                <label class="form-label">Default Landing Page</label>
                <select class="form-input" [(ngModel)]="defaultPage">
                  <option value="dashboard">Dashboard</option>
                  <option value="analytics">Analytics</option>
                  <option value="create">Create Link</option>
                </select>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-label">Compact Sidebar</span>
                  <span class="setting-desc">Use a narrower sidebar for more content space</span>
                </div>
                <input type="checkbox" class="toggle" [(ngModel)]="compactSidebar">
              </div>
            </div>
          </div>

          <!-- Billing -->
          <div class="settings-section" *ngIf="activeSection === 'billing'">
            <div class="card plan-card">
              <div class="plan-header">
                <div>
                  <h2 class="plan-name">Pro Plan</h2>
                  <p class="plan-price">$29/month</p>
                </div>
                <span class="plan-badge">Current Plan</span>
              </div>
              <ul class="plan-features">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Unlimited Smart Links
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Advanced Analytics
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Custom Routing Rules
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Retargeting Pixels
                </li>
              </ul>
            </div>

            <div class="card">
              <h2 class="section-title">Billing History</h2>
              <div class="billing-table">
                <div class="billing-row header">
                  <span>Date</span>
                  <span>Description</span>
                  <span>Amount</span>
                  <span>Status</span>
                </div>
                <div class="billing-row" *ngFor="let inv of invoices">
                  <span>{{ inv.date }}</span>
                  <span>{{ inv.description }}</span>
                  <span class="billing-amount">{{ inv.amount }}</span>
                  <span class="billing-status paid">{{ inv.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1200px;
      animation: fadeIn 0.5s ease-out;
    }

    .page-header { margin-bottom: 2rem; }

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

    .settings-layout {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 2rem;
    }

    .settings-nav {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      position: sticky;
      top: 1rem;
      align-self: flex-start;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: transparent;
      border: none;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
    }

    .nav-item:hover {
      background: rgba(59, 130, 246, 0.05);
      color: var(--text-primary);
    }

    .nav-item.active {
      background: rgba(59, 130, 246, 0.08);
      color: var(--accent-blue);
      font-weight: 600;
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .nav-icon :global(svg) {
      width: 18px;
      height: 18px;
    }

    /* Cards */
    .card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1.25rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .section-desc {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0 0 1rem 0;
    }

    .form-group { margin-bottom: 1rem; }

    /* Setting Items */
    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: var(--background);
      border-radius: 12px;
      margin-bottom: 0.5rem;
    }

    .setting-label { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); display: block; }
    .setting-desc { font-size: 0.8125rem; color: var(--text-muted); }

    /* Theme */
    .theme-options {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .theme-option {
      flex: 1;
      padding: 1rem;
      background: transparent;
      border: 2px solid var(--border-color);
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .theme-option:hover { border-color: var(--text-muted); }

    .theme-option.active {
      border-color: var(--accent-blue);
      background: rgba(59, 130, 246, 0.04);
    }

    .theme-preview {
      width: 100%;
      height: 64px;
      border-radius: 8px;
      overflow: hidden;
      display: grid;
      grid-template-columns: 20px 1fr;
      grid-template-rows: 10px 1fr;
      gap: 2px;
      background: var(--border-color);
      margin-bottom: 0.75rem;
    }

    .preview-header { grid-column: 1 / -1; background: #1c2e4a; }
    .preview-sidebar { background: #1c2e4a; }
    .preview-content { background: #f5f7fa; }
    .theme-preview.dark .preview-content { background: #0f172a; }
    .theme-preview.auto .preview-content { background: linear-gradient(135deg, #f5f7fa 50%, #0f172a 50%); }
    .theme-label { font-size: 0.8125rem; font-weight: 500; color: var(--text-primary); }

    /* Plan Card */
    .plan-card {
      background: linear-gradient(135deg, rgb(28, 46, 74) 0%, rgb(45, 75, 120) 100%);
      border: none;
      color: white;
    }

    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .plan-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.25rem 0;
    }

    .plan-price {
      font-size: 1rem;
      color: rgba(255,255,255,0.7);
      margin: 0;
    }

    .plan-badge {
      padding: 0.375rem 1rem;
      background: rgba(255,255,255,0.2);
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .plan-features {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .plan-features li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .plan-features svg {
      width: 18px;
      height: 18px;
      color: #6ee7b7;
      flex-shrink: 0;
    }

    /* Billing Table */
    .billing-table {
      margin-top: 0.75rem;
    }

    .billing-row {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr 1fr;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border-light);
      font-size: 0.875rem;
    }

    .billing-row.header {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    .billing-row:last-child { border-bottom: none; }

    .billing-amount { font-weight: 600; }

    .billing-status.paid {
      color: var(--success);
      font-weight: 500;
      text-transform: capitalize;
    }

    @media (max-width: 768px) {
      .settings-layout { grid-template-columns: 1fr; }
      .settings-nav { flex-direction: row; overflow-x: auto; position: static; }
      .plan-features { grid-template-columns: 1fr; }
      .theme-options { flex-direction: column; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class SettingsComponent {
  activeSection = 'routing';
  defaultCountry = 'US';
  defaultFormat = 'auto';
  enableBridgePage = false;
  autoGeoRouting = true;
  accountName = 'Sarah Mitchell';
  accountEmail = 'sarah@authorflow.com';
  authorName = 'Sarah Mitchell';
  twoFactorEnabled = false;
  theme = 'light';
  defaultPage = 'dashboard';
  compactSidebar = false;

  sections = [
    { id: 'routing', label: 'Routing', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
    { id: 'account', label: 'Account', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
    { id: 'notifications', label: 'Notifications', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' },
    { id: 'appearance', label: 'Appearance', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' },
    { id: 'billing', label: 'Billing', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' }
  ];

  emailNotifications = [
    { title: 'Broken Link Alerts', description: 'Get notified when a retailer link goes down', enabled: true },
    { title: 'Click Milestones', description: 'Notifications when you hit click milestones', enabled: true },
    { title: 'Weekly Click Reports', description: 'Summary of your smart link performance', enabled: true },
    { title: 'Product Updates', description: 'News about SC Smart Links features', enabled: false }
  ];

  invoices = [
    { date: 'Feb 1, 2026', description: 'Pro Plan — Monthly', amount: '$29.00', status: 'paid' },
    { date: 'Jan 1, 2026', description: 'Pro Plan — Monthly', amount: '$29.00', status: 'paid' },
    { date: 'Dec 1, 2025', description: 'Pro Plan — Monthly', amount: '$29.00', status: 'paid' }
  ];
}
