import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SmartLinkService } from '../../services/smart-link.service';
import { SmartLink, RoutingRule } from '../../models/smart-link.model';

interface RetailerInput {
  name: string;
  url: string;
  available: boolean;
  priority: number;
  countryCode: string;
}

interface CampaignSource {
  name: string;
  icon: string;
  selected: boolean;
}

@Component({
  selector: 'app-create-link',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">Create Smart Link</h1>
          <p class="page-subtitle">Set up a new universal book link in a few simple steps</p>
        </div>
      </div>

      <div class="wizard-container">
        <!-- Step Indicator -->
        <div class="steps-bar">
          <div *ngFor="let step of steps; let i = index"
               class="step-item"
               [class.active]="currentStep >= i + 1"
               [class.completed]="currentStep > i + 1"
               (click)="goToStep(i + 1)">
            <div class="step-circle">
              <svg *ngIf="currentStep > i + 1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span *ngIf="currentStep <= i + 1">{{ i + 1 }}</span>
            </div>
            <span class="step-label">{{ step }}</span>
          </div>
          <div class="step-progress">
            <div class="step-progress-fill" [style.width]="((currentStep - 1) / (steps.length - 1)) * 100 + '%'"></div>
          </div>
        </div>

        <!-- Step 1: Book Info -->
        <div class="step-content" *ngIf="currentStep === 1">
          <div class="form-card">
            <div class="card-icon-header">
              <div class="card-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
              <div>
                <h2 class="section-title">Book Information</h2>
                <p class="section-desc">Tell us about your book</p>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group full-width">
                <label class="form-label">Book Title *</label>
                <input type="text" class="form-input" [(ngModel)]="bookTitle" placeholder="Enter your book title">
              </div>
              <div class="form-group full-width">
                <label class="form-label">Cover Image URL</label>
                <input type="text" class="form-input" [(ngModel)]="coverUrl" placeholder="https://... (optional)">
              </div>
              <div class="form-group">
                <label class="form-label">Release Date</label>
                <input type="date" class="form-input" [(ngModel)]="releaseDate">
              </div>
              <div class="form-group">
                <label class="form-label">Pre-order</label>
                <div class="toggle-row">
                  <input type="checkbox" class="toggle" [(ngModel)]="isPreorder">
                  <span class="toggle-label">{{ isPreorder ? 'Yes — Pre-order' : 'No — Published' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-card">
            <h2 class="section-title">Book Formats</h2>
            <p class="section-desc">Select the formats your book is available in</p>
            <div class="formats-grid">
              <div class="format-card" *ngFor="let fmt of formats"
                   [class.selected]="fmt.selected"
                   (click)="fmt.selected = !fmt.selected">
                <div class="format-icon" [innerHTML]="fmt.icon"></div>
                <span class="format-name">{{ fmt.name }}</span>
                <div class="format-check" *ngIf="fmt.selected">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <div></div>
            <button class="btn-primary" (click)="nextStep()">Continue to Retailers →</button>
          </div>
        </div>

        <!-- Step 2: Retailers -->
        <div class="step-content" *ngIf="currentStep === 2">
          <div class="form-card">
            <div class="card-icon-header">
              <div class="card-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <div>
                <h2 class="section-title">Add Retailer Links</h2>
                <p class="section-desc">Add links for each retailer where your book is available</p>
              </div>
            </div>

            <div class="retailer-list">
              <div class="retailer-row" *ngFor="let ret of retailers; let i = index">
                <div class="retailer-info">
                  <span class="retailer-name">{{ ret.name }}</span>
                  <span class="retailer-country">{{ ret.countryCode }}</span>
                </div>
                <input type="text" class="form-input retailer-url"
                       [(ngModel)]="ret.url"
                       placeholder="Paste retailer URL here">
                <div class="retailer-toggle">
                  <input type="checkbox" class="toggle" [(ngModel)]="ret.available">
                </div>
                <div class="retailer-priority">
                  <label class="priority-label">Priority</label>
                  <input type="range" min="1" max="5"
                         [(ngModel)]="ret.priority"
                         class="priority-slider">
                  <span class="priority-value">{{ ret.priority }}</span>
                </div>
              </div>
            </div>

            <button class="btn-add-retailer" (click)="addCustomRetailer()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Custom Retailer
            </button>
          </div>

          <div class="form-actions">
            <button class="btn-secondary" (click)="prevStep()">← Back</button>
            <button class="btn-primary" (click)="nextStep()">Continue to Routing →</button>
          </div>
        </div>

        <!-- Step 3: Smart Routing Rules -->
        <div class="step-content" *ngIf="currentStep === 3">
          <div class="form-card">
            <div class="card-icon-header">
              <div class="card-icon teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div>
                <h2 class="section-title">Smart Routing Rules</h2>
                <p class="section-desc">Define how your link routes readers to the right store. Drag to reorder priority.</p>
              </div>
            </div>

            <div class="rules-list">
              <div class="rule-card" *ngFor="let rule of routingRules; let i = index">
                <div class="rule-drag-handle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </div>
                <div class="rule-content">
                  <div class="rule-row">
                    <span class="rule-keyword">IF</span>
                    <select class="form-input rule-select" [(ngModel)]="rule.conditionType">
                      <option value="country">Country</option>
                      <option value="device">Device</option>
                      <option value="format">Format</option>
                    </select>
                    <span class="rule-keyword">=</span>
                    <select class="form-input rule-select" [(ngModel)]="rule.conditionValue">
                      <option *ngIf="rule.conditionType === 'country'" value="UK">United Kingdom</option>
                      <option *ngIf="rule.conditionType === 'country'" value="Canada">Canada</option>
                      <option *ngIf="rule.conditionType === 'country'" value="Australia">Australia</option>
                      <option *ngIf="rule.conditionType === 'country'" value="Germany">Germany</option>
                      <option *ngIf="rule.conditionType === 'device'" value="iOS">iOS</option>
                      <option *ngIf="rule.conditionType === 'device'" value="Android">Android</option>
                      <option *ngIf="rule.conditionType === 'device'" value="Kindle">Kindle</option>
                      <option *ngIf="rule.conditionType === 'format'" value="Ebook">Ebook</option>
                      <option *ngIf="rule.conditionType === 'format'" value="Audiobook">Audiobook</option>
                    </select>
                    <span class="rule-keyword">→</span>
                    <input type="text" class="form-input rule-action" [(ngModel)]="rule.action"
                           placeholder="Route to...">
                  </div>
                </div>
                <button class="rule-remove" (click)="removeRule(i)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <button class="btn-add-retailer" (click)="addRule()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Routing Rule
            </button>
          </div>

          <div class="form-actions">
            <button class="btn-secondary" (click)="prevStep()">← Back</button>
            <button class="btn-primary" (click)="nextStep()">Continue to Campaign →</button>
          </div>
        </div>

        <!-- Step 4: Campaign Tracking -->
        <div class="step-content" *ngIf="currentStep === 4">
          <div class="form-card">
            <div class="card-icon-header">
              <div class="card-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div>
                <h2 class="section-title">Campaign Tracking</h2>
                <p class="section-desc">Set up UTM tracking so you know where your clicks come from</p>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Auto UTM Generation</span>
                <span class="setting-desc">Automatically append UTM parameters to your links</span>
              </div>
              <input type="checkbox" class="toggle" [(ngModel)]="utmEnabled">
            </div>

            <div class="form-group" style="margin-top: 1.25rem;" *ngIf="utmEnabled">
              <label class="form-label">Campaign Name</label>
              <input type="text" class="form-input" [(ngModel)]="campaignName" placeholder="e.g. launch_week">
            </div>

            <div *ngIf="utmEnabled">
              <label class="form-label" style="margin-top: 1.25rem; display: block;">Platform Sources</label>
              <div class="sources-grid">
                <button *ngFor="let src of campaignSources"
                        class="source-chip"
                        [class.selected]="src.selected"
                        (click)="src.selected = !src.selected">
                  <span class="source-icon" [innerHTML]="src.icon"></span>
                  {{ src.name }}
                </button>
              </div>
            </div>

            <div class="url-preview" *ngIf="utmEnabled && campaignName">
              <label class="form-label">Preview of tracked URL</label>
              <div class="preview-url-box">
                <code>{{ generatedUrl }}</code>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-secondary" (click)="prevStep()">← Back</button>
            <button class="btn-primary" (click)="nextStep()">Continue to Landing Page →</button>
          </div>
        </div>

        <!-- Step 5: Landing Page -->
        <div class="step-content" *ngIf="currentStep === 5">
          <div class="form-card">
            <div class="card-icon-header">
              <div class="card-icon gradient">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </div>
              <div>
                <h2 class="section-title">Smart Landing Page</h2>
                <p class="section-desc">Configure your reader-facing landing page</p>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Show Smart Landing Page</span>
                <span class="setting-desc">Display a branded page showing all format & retailer options</span>
              </div>
              <input type="checkbox" class="toggle" [(ngModel)]="landingPage">
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Auto-Select Preferred Format</span>
                <span class="setting-desc">Automatically choose the best format based on device</span>
              </div>
              <input type="checkbox" class="toggle" [(ngModel)]="autoFormat">
            </div>
          </div>

          <!-- Landing Page Preview -->
          <div class="form-card" *ngIf="landingPage">
            <h2 class="section-title">Landing Page Preview</h2>
            <div class="landing-preview">
              <div class="lp-book-cover">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
              <h3 class="lp-title">{{ bookTitle || 'Your Book Title' }}</h3>
              <p class="lp-subtitle">Available Formats</p>
              <div class="lp-buttons">
                <button class="lp-btn" *ngFor="let fmt of getSelectedFormats()">
                  Buy {{ fmt.name }}
                </button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-secondary" (click)="prevStep()">← Back</button>
            <button class="btn-primary create-btn" (click)="createLink()">✓ Create Smart Link</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 900px;
      animation: fadeIn 0.5s ease-out;
    }

    .page-header { margin-bottom: 1.5rem; }

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

    /* Steps Bar */
    .steps-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      padding: 1.5rem 2rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      position: relative;
    }

    .step-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--border-light);
      border-radius: 0 0 16px 16px;
      overflow: hidden;
    }

    .step-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      transition: width 0.4s ease;
      border-radius: 0 0 16px 16px;
    }

    .step-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      z-index: 1;
    }

    .step-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8125rem;
      font-weight: 600;
      background: var(--background-subtle);
      color: var(--text-muted);
      border: 2px solid var(--border-color);
      transition: all 0.3s ease;
    }

    .step-circle svg {
      width: 16px;
      height: 16px;
    }

    .step-item.active .step-circle {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      border-color: transparent;
    }

    .step-item.completed .step-circle {
      background: var(--success);
      color: white;
      border-color: transparent;
    }

    .step-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-muted);
    }

    .step-item.active .step-label {
      color: var(--text-primary);
      font-weight: 600;
    }

    /* Form Cards */
    .form-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .card-icon-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      flex-shrink: 0;
    }

    .card-icon svg {
      width: 24px;
      height: 24px;
    }

    .card-icon.blue { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
    .card-icon.purple { background: rgba(139, 92, 246, 0.12); color: #8b5cf6; }
    .card-icon.teal { background: rgba(20, 184, 166, 0.12); color: #14b8a6; }
    .card-icon.orange { background: rgba(245, 158, 11, 0.12); color: #f59e0b; }
    .card-icon.gradient { background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15)); color: #6366f1; }

    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.125rem 0;
    }

    .section-desc {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .full-width { grid-column: 1 / -1; }
    .form-group { margin-bottom: 0.25rem; }

    .toggle-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.375rem;
    }

    .toggle-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    /* Formats */
    .formats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-top: 1rem;
    }

    .format-card {
      padding: 1.25rem;
      border: 2px solid var(--border-light);
      border-radius: 14px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .format-card:hover { border-color: var(--accent-blue); }

    .format-card.selected {
      border-color: var(--accent-blue);
      background: rgba(59, 130, 246, 0.05);
    }

    .format-icon { margin-bottom: 0.5rem; }

    .format-icon :global(svg) {
      width: 28px;
      height: 28px;
      color: var(--text-muted);
    }

    .format-card.selected .format-icon :global(svg) { color: var(--accent-blue); }

    .format-name {
      display: block;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .format-check {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      background: var(--accent-blue);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .format-check svg {
      width: 12px;
      height: 12px;
      color: white;
    }

    /* Retailers */
    .retailer-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .retailer-row {
      display: grid;
      grid-template-columns: 140px 1fr auto auto;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: var(--background);
      border-radius: 14px;
      transition: all 0.2s ease;
    }

    .retailer-row:hover {
      background: rgba(59, 130, 246, 0.04);
    }

    .retailer-info { display: flex; flex-direction: column; }
    .retailer-name { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }
    .retailer-country { font-size: 0.6875rem; color: var(--text-muted); }
    .retailer-url { flex: 1; }

    .retailer-priority {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .priority-label {
      font-size: 0.6875rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .priority-slider {
      width: 60px;
      accent-color: var(--accent-blue);
    }

    .priority-value {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--accent-blue);
      min-width: 14px;
      text-align: center;
    }

    .btn-add-retailer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: transparent;
      color: var(--accent-blue);
      border: 1px dashed var(--accent-blue);
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      margin-top: 1rem;
      transition: all 0.2s ease;
      width: 100%;
      justify-content: center;
    }

    .btn-add-retailer svg {
      width: 16px;
      height: 16px;
    }

    .btn-add-retailer:hover {
      background: rgba(59, 130, 246, 0.06);
    }

    /* Routing Rules */
    .rules-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .rule-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--background);
      border-radius: 14px;
      border: 1px solid var(--border-light);
      transition: all 0.2s ease;
    }

    .rule-card:hover {
      border-color: var(--accent-blue);
    }

    .rule-drag-handle {
      cursor: grab;
      color: var(--text-muted);
      flex-shrink: 0;
    }

    .rule-drag-handle svg {
      width: 18px;
      height: 18px;
    }

    .rule-content { flex: 1; }

    .rule-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .rule-keyword {
      font-size: 0.8125rem;
      font-weight: 700;
      color: var(--accent-blue);
      padding: 0.25rem 0.5rem;
      background: rgba(59, 130, 246, 0.08);
      border-radius: 6px;
      white-space: nowrap;
    }

    .rule-select {
      min-width: 120px;
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
    }

    .rule-action {
      flex: 1;
      min-width: 140px;
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
    }

    .rule-remove {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      border-radius: 6px;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .rule-remove svg { width: 16px; height: 16px; }

    .rule-remove:hover {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }

    /* Campaign */
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

    .sources-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .source-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 100px;
      background: white;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .source-chip.selected {
      background: rgba(59, 130, 246, 0.08);
      border-color: var(--accent-blue);
      color: var(--accent-blue);
    }

    .source-icon :global(svg) {
      width: 14px;
      height: 14px;
    }

    .url-preview {
      margin-top: 1.25rem;
    }

    .preview-url-box {
      padding: 1rem;
      background: var(--background);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      margin-top: 0.5rem;
    }

    .preview-url-box code {
      font-size: 0.8125rem;
      color: var(--accent-blue);
      word-break: break-all;
    }

    /* Landing Page Preview */
    .landing-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      background: var(--background);
      border-radius: 16px;
      margin-top: 1rem;
      border: 1px dashed var(--border-color);
    }

    .lp-book-cover {
      width: 100px;
      height: 140px;
      background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    }

    .lp-book-cover svg {
      width: 36px;
      height: 36px;
      color: var(--accent-blue);
    }

    .lp-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
      text-align: center;
    }

    .lp-subtitle {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin: 0 0 1rem 0;
    }

    .lp-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      max-width: 280px;
    }

    .lp-btn {
      padding: 0.75rem;
      background: var(--gradient-primary);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .lp-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(28,46,74,0.3);
    }

    /* Actions */
    .form-actions {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .create-btn {
      background: linear-gradient(135deg, #10b981, #14b8a6) !important;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
      .formats-grid { grid-template-columns: repeat(2, 1fr); }
      .retailer-row { grid-template-columns: 1fr; }
      .steps-bar { flex-wrap: wrap; gap: 0.5rem; }
      .step-label { display: none; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class CreateLinkComponent {
  currentStep = 1;
  steps = ['Book Info', 'Retailers', 'Routing', 'Campaign', 'Landing Page'];

  bookTitle = '';
  coverUrl = '';
  isPreorder = false;
  releaseDate = '';
  landingPage = true;
  autoFormat = true;
  utmEnabled = true;
  campaignName = '';

  formats = [
    { name: 'Ebook', selected: true, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>' },
    { name: 'Paperback', selected: false, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
    { name: 'Hardcover', selected: false, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="2" width="18" height="20" rx="2"/><line x1="8" y1="2" x2="8" y2="22"/></svg>' },
    { name: 'Audiobook', selected: false, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>' }
  ];

  retailers: RetailerInput[] = [
    { name: 'Amazon US', url: '', available: true, priority: 1, countryCode: 'US' },
    { name: 'Amazon UK', url: '', available: true, priority: 2, countryCode: 'UK' },
    { name: 'Amazon CA', url: '', available: true, priority: 3, countryCode: 'CA' },
    { name: 'Kobo', url: '', available: true, priority: 3, countryCode: 'Global' },
    { name: 'Apple Books', url: '', available: true, priority: 4, countryCode: 'Global' },
    { name: 'Barnes & Noble', url: '', available: false, priority: 5, countryCode: 'US' }
  ];

  routingRules: RoutingRule[] = [
    { id: '1', conditionType: 'country', conditionValue: 'UK', action: 'Route to Amazon UK', priority: 1 },
    { id: '2', conditionType: 'device', conditionValue: 'iOS', action: 'Prioritize Apple Books', priority: 2 }
  ];

  campaignSources: CampaignSource[] = [
    { name: 'Facebook', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>', selected: false },
    { name: 'Instagram', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>', selected: false },
    { name: 'Email', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>', selected: true },
    { name: 'TikTok', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>', selected: false },
    { name: 'Blog', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>', selected: false },
    { name: 'Custom', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>', selected: false }
  ];

  get generatedUrl(): string {
    const selectedSources = this.campaignSources.filter(s => s.selected).map(s => s.name.toLowerCase()).join(',');
    return `https://sc.link/${this.bookTitle.replace(/ /g, '-').toLowerCase().slice(0, 20)}?utm_source=${selectedSources || 'direct'}&utm_medium=smartlink&utm_campaign=${this.campaignName}`;
  }

  constructor(private smartLinkService: SmartLinkService, private router: Router) { }

  nextStep() { if (this.currentStep < 5) this.currentStep++; }
  prevStep() { if (this.currentStep > 1) this.currentStep--; }
  goToStep(s: number) { if (s <= this.currentStep) this.currentStep = s; }

  getSelectedFormats() {
    return this.formats.filter(f => f.selected);
  }

  addCustomRetailer() {
    this.retailers.push({
      name: 'Custom Retailer',
      url: '',
      available: true,
      priority: this.retailers.length + 1,
      countryCode: 'Global'
    });
  }

  addRule() {
    this.routingRules.push({
      id: Date.now().toString(),
      conditionType: 'country',
      conditionValue: 'UK',
      action: '',
      priority: this.routingRules.length + 1
    });
  }

  removeRule(i: number) {
    this.routingRules.splice(i, 1);
  }

  createLink() {
    const slug = this.bookTitle.replace(/ /g, '-').toLowerCase().slice(0, 20);
    const newLink: SmartLink = {
      id: Date.now().toString(),
      bookTitle: this.bookTitle,
      coverUrl: this.coverUrl,
      shortUrl: `https://sc.link/${slug}`,
      totalClicks: 0,
      status: this.isPreorder ? 'scheduled' : 'active',
      createdAt: new Date(),
      releaseDate: this.releaseDate ? new Date(this.releaseDate) : undefined,
      isPreorder: this.isPreorder,
      formats: this.formats.filter(f => f.selected).map(f => ({
        type: f.name.toLowerCase() as any,
        price: 0,
        currency: 'USD'
      })),
      retailers: this.retailers.filter(r => r.url.trim()).map((r, i) => ({
        id: (i + 1).toString(),
        name: r.name,
        url: r.url,
        countryCode: r.countryCode,
        available: r.available,
        priority: r.priority,
        icon: r.name.toLowerCase().replace(/ /g, '')
      })),
      routingRules: this.routingRules,
      campaigns: this.campaignSources.filter(s => s.selected).map((s, i) => ({
        id: (i + 1).toString(),
        name: this.campaignName || 'Default',
        source: s.name.toLowerCase(),
        medium: 'smartlink',
        utmEnabled: this.utmEnabled,
        clicks: 0
      })),
      landingPageEnabled: this.landingPage,
      autoSelectFormat: this.autoFormat
    };
    this.smartLinkService.addLink(newLink);
    this.router.navigate(['/dashboard']);
  }
}
