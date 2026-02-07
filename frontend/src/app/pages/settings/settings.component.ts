import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SettingsSection {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">Settings</h1>
          <p class="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div class="settings-layout">
        <!-- Settings Navigation -->
        <nav class="settings-nav animate-fade-in-up">
          <button *ngFor="let section of sections" 
                  class="nav-item"
                  [class.active]="activeSection === section.id"
                  (click)="activeSection = section.id">
            <span class="nav-icon" [innerHTML]="section.icon"></span>
            <span class="nav-label">{{ section.label }}</span>
          </button>
        </nav>

        <!-- Settings Content -->
        <div class="settings-content">
          <!-- Profile Section -->
          <div *ngIf="activeSection === 'profile'" class="settings-section animate-fade-in-up">
            <div class="section-header">
              <h2 class="section-title">Profile Information</h2>
              <p class="section-description">Update your personal details and profile picture</p>
            </div>

            <div class="settings-card">
              <div class="profile-header">
                <div class="avatar-section">
                  <div class="avatar-large">
                    <span class="avatar-initials">SC</span>
                    <button class="avatar-edit">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </button>
                  </div>
                  <div class="avatar-info">
                    <span class="avatar-name">ScribeCount User</span>
                    <span class="avatar-plan">Pro Plan · Member since Jan 2024</span>
                  </div>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label>First Name</label>
                  <input type="text" class="form-input" [(ngModel)]="profile.firstName" placeholder="Enter first name">
                </div>
                <div class="form-group">
                  <label>Last Name</label>
                  <input type="text" class="form-input" [(ngModel)]="profile.lastName" placeholder="Enter last name">
                </div>
                <div class="form-group full-width">
                  <label>Email Address</label>
                  <input type="email" class="form-input" [(ngModel)]="profile.email" placeholder="Enter email">
                </div>
                <div class="form-group full-width">
                  <label>Bio</label>
                  <textarea class="form-textarea" [(ngModel)]="profile.bio" placeholder="Tell us about yourself..." rows="3"></textarea>
                </div>
              </div>

              <div class="card-actions">
                <button class="btn btn-secondary">Cancel</button>
                <button class="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>

          <!-- Account Section -->
          <div *ngIf="activeSection === 'account'" class="settings-section animate-fade-in-up">
            <div class="section-header">
              <h2 class="section-title">Account Settings</h2>
              <p class="section-description">Manage your account security and authentication</p>
            </div>

            <div class="settings-card">
              <h3 class="card-title">Change Password</h3>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>Current Password</label>
                  <input type="password" class="form-input" placeholder="Enter current password">
                </div>
                <div class="form-group">
                  <label>New Password</label>
                  <input type="password" class="form-input" placeholder="Enter new password">
                </div>
                <div class="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" class="form-input" placeholder="Confirm new password">
                </div>
              </div>
              <div class="card-actions">
                <button class="btn btn-primary">Update Password</button>
              </div>
            </div>

            <div class="settings-card">
              <h3 class="card-title">Two-Factor Authentication</h3>
              <div class="toggle-row">
                <div class="toggle-info">
                  <span class="toggle-title">Enable 2FA</span>
                  <span class="toggle-description">Add an extra layer of security to your account</span>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="twoFactorEnabled">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="settings-card danger">
              <h3 class="card-title danger">Danger Zone</h3>
              <div class="danger-row">
                <div class="danger-info">
                  <span class="danger-title">Delete Account</span>
                  <span class="danger-description">Permanently delete your account and all associated data</span>
                </div>
                <button class="btn btn-danger">Delete Account</button>
              </div>
            </div>
          </div>

          <!-- Notifications Section -->
          <div *ngIf="activeSection === 'notifications'" class="settings-section animate-fade-in-up">
            <div class="section-header">
              <h2 class="section-title">Notification Preferences</h2>
              <p class="section-description">Choose how and when you want to be notified</p>
            </div>

            <div class="settings-card">
              <h3 class="card-title">Email Notifications</h3>
              <div class="notifications-grid">
                <div *ngFor="let notif of emailNotifications" class="toggle-row">
                  <div class="toggle-info">
                    <span class="toggle-title">{{ notif.title }}</span>
                    <span class="toggle-description">{{ notif.description }}</span>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" [(ngModel)]="notif.enabled">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div class="settings-card">
              <h3 class="card-title">Push Notifications</h3>
              <div class="notifications-grid">
                <div *ngFor="let notif of pushNotifications" class="toggle-row">
                  <div class="toggle-info">
                    <span class="toggle-title">{{ notif.title }}</span>
                    <span class="toggle-description">{{ notif.description }}</span>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" [(ngModel)]="notif.enabled">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Billing Section -->
          <div *ngIf="activeSection === 'billing'" class="settings-section animate-fade-in-up">
            <div class="section-header">
              <h2 class="section-title">Billing & Subscription</h2>
              <p class="section-description">Manage your subscription and payment methods</p>
            </div>

            <div class="plan-card">
              <div class="plan-badge">Current Plan</div>
              <div class="plan-info">
                <h3 class="plan-name">Pro Plan</h3>
                <p class="plan-price">$29<span class="price-period">/month</span></p>
              </div>
              <ul class="plan-features">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Unlimited reports
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Advanced analytics
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Hey ScribeCount AI (100 queries/month)
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Email integration
                </li>
              </ul>
              <div class="plan-actions">
                <button class="btn btn-secondary">Change Plan</button>
                <button class="btn btn-ghost">Cancel Subscription</button>
              </div>
            </div>

            <div class="settings-card">
              <h3 class="card-title">Payment Method</h3>
              <div class="payment-method">
                <div class="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <div class="card-details">
                  <span class="card-type">Visa ending in 4242</span>
                  <span class="card-expiry">Expires 12/2026</span>
                </div>
                <button class="btn btn-secondary btn-sm">Update</button>
              </div>
            </div>

            <div class="settings-card">
              <h3 class="card-title">Billing History</h3>
              <div class="billing-table">
                <div class="billing-row header">
                  <span>Date</span>
                  <span>Description</span>
                  <span>Amount</span>
                  <span>Status</span>
                </div>
                <div *ngFor="let invoice of invoices" class="billing-row">
                  <span>{{ invoice.date }}</span>
                  <span>{{ invoice.description }}</span>
                  <span>{{ invoice.amount }}</span>
                  <span class="status" [class]="invoice.status">{{ invoice.status }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Appearance Section -->
          <div *ngIf="activeSection === 'appearance'" class="settings-section animate-fade-in-up">
            <div class="section-header">
              <h2 class="section-title">Appearance</h2>
              <p class="section-description">Customize the look and feel of your dashboard</p>
            </div>

            <div class="settings-card">
              <h3 class="card-title">Theme</h3>
              <div class="theme-options">
                <button class="theme-option" [class.active]="theme === 'light'" (click)="theme = 'light'">
                  <div class="theme-preview light">
                    <div class="preview-header"></div>
                    <div class="preview-sidebar"></div>
                    <div class="preview-content"></div>
                  </div>
                  <span class="theme-label">Light</span>
                </button>
                <button class="theme-option" [class.active]="theme === 'dark'" (click)="theme = 'dark'">
                  <div class="theme-preview dark">
                    <div class="preview-header"></div>
                    <div class="preview-sidebar"></div>
                    <div class="preview-content"></div>
                  </div>
                  <span class="theme-label">Dark</span>
                </button>
                <button class="theme-option" [class.active]="theme === 'system'" (click)="theme = 'system'">
                  <div class="theme-preview system">
                    <div class="preview-header"></div>
                    <div class="preview-sidebar"></div>
                    <div class="preview-content"></div>
                  </div>
                  <span class="theme-label">System</span>
                </button>
              </div>
            </div>

            <div class="settings-card">
              <h3 class="card-title">Dashboard Layout</h3>
              <div class="form-group">
                <label>Default Page</label>
                <select class="form-select" [(ngModel)]="defaultPage">
                  <option value="dashboard">Dashboard</option>
                  <option value="reports">Reports</option>
                  <option value="analytics">Analytics</option>
                </select>
              </div>
              <div class="toggle-row">
                <div class="toggle-info">
                  <span class="toggle-title">Compact Sidebar</span>
                  <span class="toggle-description">Show collapsed sidebar by default</span>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="compactSidebar">
                  <span class="toggle-slider"></span>
                </label>
              </div>
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
      margin-bottom: 2rem;
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

    /* Settings Layout */
    .settings-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 2rem;
    }

    @media (max-width: 1024px) {
      .settings-layout {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }

    /* Settings Navigation */
    .settings-nav {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      position: sticky;
      top: 2rem;
      align-self: start;
    }

    @media (max-width: 1024px) {
      .settings-nav {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5rem;
        position: static;
      }
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: transparent;
      border: none;
      border-radius: 10px;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .nav-item:hover {
      background: var(--background);
      color: var(--text-primary);
    }

    .nav-item.active {
      background: var(--primary-light);
      color: var(--primary);
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-icon svg,
    .nav-icon :global(svg) {
      width: 100%;
      height: 100%;
    }

    /* Settings Content */
    .settings-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .section-header {
      margin-bottom: 0.5rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .section-description {
      font-size: 0.9375rem;
      color: var(--text-muted);
      margin: 0;
    }

    /* Settings Card */
    .settings-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .settings-card.danger {
      border-color: rgba(239, 68, 68, 0.3);
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 1.25rem 0;
    }

    .card-title.danger {
      color: var(--error);
    }

    /* Profile Header */
    .profile-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .avatar-large {
      position: relative;
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-initials {
      font-size: 1.75rem;
      font-weight: 700;
      color: white;
    }

    .avatar-edit {
      position: absolute;
      bottom: -4px;
      right: -4px;
      width: 28px;
      height: 28px;
      background: white;
      border: 2px solid var(--border-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .avatar-edit:hover {
      background: var(--background);
      border-color: var(--primary);
    }

    .avatar-edit svg {
      width: 14px;
      height: 14px;
      color: var(--text-secondary);
    }

    .avatar-name {
      display: block;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .avatar-plan {
      display: block;
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .form-input,
    .form-select,
    .form-textarea {
      padding: 0.625rem 0.875rem;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      font-size: 0.875rem;
      background: white;
      color: var(--text-primary);
      transition: all 0.2s ease;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-input::placeholder,
    .form-textarea::placeholder {
      color: var(--text-light);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      padding-right: 2.5rem;
    }

    /* Card Actions */
    .card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-light);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, rgb(28, 46, 74) 0%, rgb(45, 75, 120) 100%);
      color: white;
    }

    .btn-secondary {
      background: white;
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    .btn-ghost {
      background: transparent;
      color: var(--text-muted);
    }

    .btn-danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    /* Toggle Switch */
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
      border-bottom: 1px solid var(--border-light);
    }

    .toggle-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .toggle-row:first-child {
      padding-top: 0;
    }

    .toggle-info {
      flex: 1;
    }

    .toggle-title {
      display: block;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .toggle-description {
      display: block;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .toggle-switch {
      position: relative;
      width: 48px;
      height: 28px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background-color: #e2e8f0;
      transition: 0.3s;
      border-radius: 34px;
    }

    .toggle-slider::before {
      position: absolute;
      content: "";
      height: 22px;
      width: 22px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .toggle-switch input:checked + .toggle-slider {
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    }

    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(20px);
    }

    /* Notifications Grid */
    .notifications-grid {
      display: flex;
      flex-direction: column;
    }

    /* Danger Zone */
    .danger-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .danger-info {
      flex: 1;
    }

    .danger-title {
      display: block;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .danger-description {
      display: block;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    /* Plan Card */
    .plan-card {
      background: linear-gradient(135deg, rgb(28, 46, 74) 0%, rgb(45, 75, 120) 100%);
      border-radius: 16px;
      padding: 2rem;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .plan-badge {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      padding: 0.25rem 0.75rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .plan-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .plan-price {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 1.5rem 0;
    }

    .price-period {
      font-size: 1rem;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.7);
    }

    .plan-features {
      list-style: none;
      padding: 0;
      margin: 0 0 1.5rem 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
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
    }

    .plan-actions {
      display: flex;
      gap: 0.75rem;
    }

    .plan-actions .btn-secondary {
      background: white;
      color: var(--primary);
      border: none;
    }

    .plan-actions .btn-ghost {
      color: rgba(255, 255, 255, 0.7);
    }

    .plan-actions .btn-ghost:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    /* Payment Method */
    .payment-method {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--background);
      border-radius: 12px;
    }

    .card-icon {
      width: 48px;
      height: 32px;
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .card-icon svg {
      width: 24px;
      height: 16px;
    }

    .card-details {
      flex: 1;
    }

    .card-type {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .card-expiry {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* Billing Table */
    .billing-table {
      display: flex;
      flex-direction: column;
    }

    .billing-row {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr 1fr;
      gap: 1rem;
      padding: 0.875rem 0;
      border-bottom: 1px solid var(--border-light);
      font-size: 0.875rem;
    }

    .billing-row.header {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    .billing-row:last-child {
      border-bottom: none;
    }

    .status {
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .status.paid {
      color: var(--success);
    }

    /* Theme Options */
    .theme-options {
      display: flex;
      gap: 1rem;
    }

    .theme-option {
      flex: 1;
      padding: 1rem;
      background: transparent;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .theme-option:hover {
      border-color: var(--text-muted);
    }

    .theme-option.active {
      border-color: var(--accent-blue);
      background: rgba(59, 130, 246, 0.05);
    }

    .theme-preview {
      width: 100%;
      height: 80px;
      border-radius: 6px;
      overflow: hidden;
      display: grid;
      grid-template-columns: 24px 1fr;
      grid-template-rows: 12px 1fr;
      gap: 2px;
      background: var(--border-color);
      margin-bottom: 0.75rem;
    }

    .preview-header {
      grid-column: 1 / -1;
      background: #1c2e4a;
    }

    .preview-sidebar {
      background: #1c2e4a;
    }

    .preview-content {
      background: #f5f7fa;
    }

    .theme-preview.dark .preview-content {
      background: #0f172a;
    }

    .theme-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .animate-fade-in-up {
      opacity: 0;
      animation: fadeInUp 0.5s ease-out forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class SettingsComponent {
  activeSection = 'profile';

  sections: SettingsSection[] = [
    { id: 'profile', label: 'Profile', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
    { id: 'account', label: 'Account', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
    { id: 'notifications', label: 'Notifications', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' },
    { id: 'billing', label: 'Billing', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
    { id: 'appearance', label: 'Appearance', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' }
  ];

  profile = {
    firstName: 'ScribeCount',
    lastName: 'User',
    email: 'user@scribecount.com',
    bio: ''
  };

  twoFactorEnabled = false;
  theme = 'light';
  defaultPage = 'dashboard';
  compactSidebar = false;

  emailNotifications = [
    { title: 'Weekly Reports', description: 'Receive a summary of your weekly royalties', enabled: true },
    { title: 'Sales Alerts', description: 'Get notified when you make a sale', enabled: true },
    { title: 'Campaign Performance', description: 'Updates on your email campaign results', enabled: true },
    { title: 'Product Updates', description: 'News about ScribeCount features', enabled: false }
  ];

  pushNotifications = [
    { title: 'Real-time Sales', description: 'Instant notifications for each sale', enabled: false },
    { title: 'Alerts', description: 'Important account alerts', enabled: true },
    { title: 'Hey ScribeCount', description: 'AI assistant responses', enabled: true }
  ];

  invoices = [
    { date: 'Jan 1, 2025', description: 'Pro Plan - Monthly', amount: '$29.00', status: 'paid' },
    { date: 'Dec 1, 2024', description: 'Pro Plan - Monthly', amount: '$29.00', status: 'paid' },
    { date: 'Nov 1, 2024', description: 'Pro Plan - Monthly', amount: '$29.00', status: 'paid' }
  ];
}
