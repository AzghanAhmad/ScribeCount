import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SmartLinkService } from '../../services/smart-link.service';
import { SmartLink, RetailerHealth, RoutingRule } from '../../models/smart-link.model';

@Component({
  selector: 'app-edit-link',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page" *ngIf="link">
      <div class="page-header">
        <div class="header-left">
          <button class="btn-back" routerLink="/dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <div>
            <h1 class="page-title">{{ link.bookTitle }}</h1>
            <div class="link-meta">
              <code class="short-url">{{ link.shortUrl }}</code>
              <button class="copy-btn" (click)="copyUrl()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </button>
              <span class="badge"
                    [class.badge-active]="link.status === 'active'"
                    [class.badge-scheduled]="link.status === 'scheduled'"
                    [class.badge-expired]="link.status === 'expired'">
                {{ link.status }}
              </span>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" [routerLink]="'/analytics/' + link.id">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            View Analytics
          </button>
          <button class="btn-primary" (click)="saveChanges()">Save Changes</button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'general'" (click)="activeTab = 'general'">General</button>
        <button class="tab" [class.active]="activeTab === 'retailers'" (click)="activeTab = 'retailers'">Retailers</button>
        <button class="tab" [class.active]="activeTab === 'routing'" (click)="activeTab = 'routing'">Routing Rules</button>
        <button class="tab" [class.active]="activeTab === 'health'" (click)="activeTab = 'health'">Link Health</button>
      </div>

      <!-- General Tab -->
      <div class="tab-content" *ngIf="activeTab === 'general'">
        <div class="card">
          <h3 class="section-title">Book Information</h3>
          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">Book Title</label>
              <input type="text" class="form-input" [(ngModel)]="link.bookTitle">
            </div>
            <div class="form-group">
              <label class="form-label">Short URL Slug</label>
              <input type="text" class="form-input" [value]="link.shortUrl" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-input" [(ngModel)]="link.status">
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title">Smart Features</h3>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">Smart Landing Page</span>
              <span class="setting-desc">Show a branded page with all purchasing options</span>
            </div>
            <input type="checkbox" class="toggle" [(ngModel)]="link.landingPageEnabled">
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">Auto-Select Format</span>
              <span class="setting-desc">Auto-choose format based on reader's device</span>
            </div>
            <input type="checkbox" class="toggle" [(ngModel)]="link.autoSelectFormat">
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">Pre-order Mode</span>
              <span class="setting-desc">Enable special handling for pre-order links</span>
            </div>
            <input type="checkbox" class="toggle" [(ngModel)]="link.isPreorder">
          </div>
        </div>

        <div class="card" *ngIf="link.formats.length">
          <h3 class="section-title">Formats</h3>
          <div class="formats-list">
            <div class="format-item" *ngFor="let fmt of link.formats">
              <span class="format-type">{{ fmt.type | titlecase }}</span>
              <span class="format-price">{{ fmt.currency }} {{ fmt.price | number:'1.2-2' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Retailers Tab -->
      <div class="tab-content" *ngIf="activeTab === 'retailers'">
        <div class="card">
          <h3 class="section-title">Retailer Links</h3>
          <p class="section-desc">Manage where your link redirects for each retailer</p>
          <div class="retailer-list">
            <div class="retailer-row" *ngFor="let ret of link.retailers; let i = index">
              <div class="retailer-info">
                <span class="retailer-name">{{ ret.name }}</span>
                <span class="retailer-country">{{ ret.countryCode }}</span>
              </div>
              <input type="text" class="form-input" [(ngModel)]="ret.url" placeholder="Retailer URL">
              <div class="retailer-toggle">
                <span class="toggle-status" [class.active]="ret.available">{{ ret.available ? 'Active' : 'Disabled' }}</span>
                <input type="checkbox" class="toggle" [(ngModel)]="ret.available">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Routing Tab -->
      <div class="tab-content" *ngIf="activeTab === 'routing'">
        <div class="card">
          <h3 class="section-title">Routing Rules</h3>
          <p class="section-desc">Control how readers get routed to the right store</p>
          <div class="rules-list">
            <div class="rule-card" *ngFor="let rule of link.routingRules; let i = index">
              <div class="rule-handle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </div>
              <div class="rule-body">
                <div class="rule-condition">
                  <span class="rule-badge">IF</span>
                  <span class="rule-type">{{ rule.conditionType | titlecase }}</span>
                  <span class="rule-eq">=</span>
                  <span class="rule-val">{{ rule.conditionValue }}</span>
                  <span class="rule-arrow">→</span>
                  <span class="rule-action-text">{{ rule.action }}</span>
                </div>
              </div>
              <button class="rule-del" (click)="removeRoutingRule(i)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
          <button class="btn-add" (click)="addRoutingRule()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Rule
          </button>
          <div class="empty-state" *ngIf="!link.routingRules.length">
            <p class="empty-text">No routing rules configured. Readers will be routed by country automatically.</p>
          </div>
        </div>
      </div>

      <!-- Health Tab -->
      <div class="tab-content" *ngIf="activeTab === 'health'">
        <div class="card">
          <h3 class="section-title">Retailer Link Health</h3>
          <p class="section-desc">Real-time monitoring of your retailer links</p>
          <div class="health-list">
            <div class="health-item" *ngFor="let h of healthData">
              <div class="health-status-dot" [class]="h.status"></div>
              <div class="health-info">
                <span class="health-name">{{ h.retailer }}</span>
                <span class="health-check">Last checked: {{ h.lastCheck }}</span>
              </div>
              <span class="health-response">{{ h.responseTime }}</span>
              <span class="health-badge" [class]="h.status">
                {{ h.status === 'healthy' ? '✓ Healthy' : h.status === 'warning' ? '⚠ Slow' : '✗ Down' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <div class="toast" [class.show]="showToast">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ toastMessage }}
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1000px;
      animation: fadeIn 0.5s ease-out;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      gap: 1rem;
    }

    .header-left {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .btn-back {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .btn-back svg { width: 18px; height: 18px; color: var(--text-muted); }
    .btn-back:hover { border-color: var(--accent-blue); }
    .btn-back:hover svg { color: var(--accent-blue); }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.375rem 0;
    }

    .link-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .short-url {
      font-size: 0.8125rem;
      color: var(--accent-blue);
      background: rgba(59, 130, 246, 0.06);
      padding: 0.25rem 0.625rem;
      border-radius: 6px;
    }

    .copy-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.625rem;
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }

    .copy-btn svg { width: 12px; height: 12px; }
    .copy-btn:hover { border-color: var(--accent-blue); color: var(--accent-blue); }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 0;
      border-bottom: 2px solid var(--border-light);
      margin-bottom: 1.5rem;
    }

    .tab {
      padding: 0.75rem 1.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s;
    }

    .tab:hover { color: var(--text-primary); }

    .tab.active {
      color: var(--accent-blue);
      border-bottom-color: var(--accent-blue);
      font-weight: 600;
    }

    /* Card */
    .card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1.25rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .section-desc {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin: 0 0 1rem 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .full-width { grid-column: 1 / -1; }

    /* Settings */
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

    /* Formats */
    .formats-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .format-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: var(--background);
      border-radius: 10px;
    }

    .format-type { font-weight: 600; font-size: 0.875rem; color: var(--text-primary); }
    .format-price { font-size: 0.875rem; color: var(--accent-blue); font-weight: 500; }

    /* Retailers */
    .retailer-list { display: flex; flex-direction: column; gap: 0.5rem; }

    .retailer-row {
      display: grid;
      grid-template-columns: 140px 1fr auto;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--background);
      border-radius: 12px;
    }

    .retailer-name { font-size: 0.875rem; font-weight: 600; display: block; }
    .retailer-country { font-size: 0.6875rem; color: var(--text-muted); }

    .retailer-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .toggle-status {
      font-size: 0.6875rem;
      font-weight: 500;
      color: var(--text-muted);
    }

    .toggle-status.active { color: var(--success); }

    /* Rules */
    .rules-list { display: flex; flex-direction: column; gap: 0.5rem; }

    .rule-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      background: var(--background);
      border: 1px solid var(--border-light);
      border-radius: 12px;
      transition: all 0.2s;
    }

    .rule-card:hover { border-color: var(--accent-blue); }

    .rule-handle { color: var(--text-muted); cursor: grab; flex-shrink: 0; }
    .rule-handle svg { width: 16px; height: 16px; }

    .rule-body { flex: 1; }

    .rule-condition {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8125rem;
      flex-wrap: wrap;
    }

    .rule-badge {
      font-size: 0.6875rem;
      font-weight: 700;
      color: var(--accent-blue);
      background: rgba(59, 130, 246, 0.08);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
    }

    .rule-type { font-weight: 600; color: var(--text-primary); }
    .rule-eq { color: var(--text-muted); }
    .rule-val { font-weight: 600; color: #8b5cf6; }
    .rule-arrow { color: var(--text-muted); }
    .rule-action-text { color: var(--text-secondary); }

    .rule-del {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      border-radius: 6px;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .rule-del svg { width: 14px; height: 14px; }
    .rule-del:hover { background: rgba(239, 68, 68, 0.1); color: var(--error); }

    .btn-add {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: transparent;
      border: 1px dashed var(--accent-blue);
      border-radius: 10px;
      color: var(--accent-blue);
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      margin-top: 0.75rem;
      width: 100%;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-add svg { width: 16px; height: 16px; }
    .btn-add:hover { background: rgba(59, 130, 246, 0.05); }

    .empty-state { text-align: center; padding: 1rem; }
    .empty-text { color: var(--text-muted); font-size: 0.875rem; }

    /* Health */
    .health-list { display: flex; flex-direction: column; gap: 0.5rem; }

    .health-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--background);
      border-radius: 12px;
      transition: all 0.2s;
    }

    .health-item:hover { background: rgba(59, 130, 246, 0.03); }

    .health-status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .health-status-dot.healthy { background: var(--success); box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
    .health-status-dot.warning { background: #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.4); }
    .health-status-dot.down { background: var(--error); box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }

    .health-info { flex: 1; display: flex; flex-direction: column; }
    .health-name { font-weight: 600; font-size: 0.875rem; color: var(--text-primary); }
    .health-check { font-size: 0.75rem; color: var(--text-muted); }
    .health-response { font-size: 0.8125rem; color: var(--text-muted); font-weight: 500; }

    .health-badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 100px;
    }

    .health-badge.healthy { background: rgba(16, 185, 129, 0.1); color: var(--success); }
    .health-badge.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .health-badge.down { background: rgba(239, 68, 68, 0.1); color: var(--error); }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.25rem;
      background: rgb(28, 46, 74);
      color: white;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
      box-shadow: 0 12px 32px rgba(0,0,0,0.2);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
    }

    .toast.show { transform: translateY(0); opacity: 1; }
    .toast svg { width: 18px; height: 18px; color: #6ee7b7; }

    @media (max-width: 768px) {
      .page-header { flex-direction: column; }
      .header-actions { width: 100%; justify-content: flex-end; }
      .form-grid { grid-template-columns: 1fr; }
      .retailer-row { grid-template-columns: 1fr; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class EditLinkComponent implements OnInit {
  link: SmartLink | undefined;
  activeTab = 'general';
  healthData: RetailerHealth[] = [];
  showToast = false;
  toastMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private smartLinkService: SmartLinkService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.link = structuredClone(this.smartLinkService.getLink(id));
      this.healthData = this.smartLinkService.getRetailerHealth();
    }
    if (!this.link) {
      this.router.navigate(['/dashboard']);
    }
  }

  copyUrl() {
    if (this.link) {
      navigator.clipboard.writeText(this.link.shortUrl);
      this.showToastMsg('Link copied to clipboard!');
    }
  }

  saveChanges() {
    if (this.link) {
      this.smartLinkService.updateLink(this.link);
      this.showToastMsg('Changes saved successfully!');
    }
  }

  addRoutingRule() {
    if (this.link) {
      this.link.routingRules.push({
        id: Date.now().toString(),
        conditionType: 'country',
        conditionValue: 'UK',
        action: 'Route to Amazon UK',
        priority: this.link.routingRules.length + 1
      });
    }
  }

  removeRoutingRule(index: number) {
    if (this.link) {
      this.link.routingRules.splice(index, 1);
    }
  }

  private showToastMsg(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2500);
  }
}
