import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TrackingPixel {
  id: string;
  platform: string;
  name: string;
  pixelId: string;
  enabled: boolean;
  eventsTracked: number;
  lastFired: string;
}

@Component({
  selector: 'app-pixels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Tracking Pixels</h1>
          <p class="page-subtitle">Manage retargeting pixels for your smart links</p>
        </div>
        <button class="btn-primary" (click)="showAddModal = true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Pixel
        </button>
      </div>

      <div class="pixels-grid">
        <div class="pixel-card" *ngFor="let pixel of pixels" [class.disabled]="!pixel.enabled">
          <div class="pixel-header">
            <div class="pixel-platform" [innerHTML]="getPlatformIcon(pixel.platform)"></div>
            <div class="pixel-info">
              <span class="pixel-name">{{ pixel.name }}</span>
              <code class="pixel-id">{{ pixel.pixelId }}</code>
            </div>
            <input type="checkbox" class="toggle" [(ngModel)]="pixel.enabled">
          </div>
          <div class="pixel-stats">
            <div class="pixel-stat">
              <span class="pixel-stat-value">{{ pixel.eventsTracked | number }}</span>
              <span class="pixel-stat-label">Events Tracked</span>
            </div>
            <div class="pixel-stat">
              <span class="pixel-stat-value">{{ pixel.lastFired }}</span>
              <span class="pixel-stat-label">Last Fired</span>
            </div>
          </div>
          <div class="pixel-footer">
            <span class="pixel-status" [class.active]="pixel.enabled">
              {{ pixel.enabled ? '● Active' : '○ Paused' }}
            </span>
            <button class="pixel-delete" (click)="deletePixel(pixel.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div class="empty-card" *ngIf="pixels.length === 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <p class="empty-title">No tracking pixels yet</p>
          <p class="empty-desc">Add tracking pixels to retarget readers who click your smart links</p>
          <button class="btn-primary small" (click)="showAddModal = true">Add Your First Pixel</button>
        </div>
      </div>

      <!-- Add Modal -->
      <div class="modal-overlay" *ngIf="showAddModal" (click)="showAddModal = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Add Tracking Pixel</h2>
            <button class="modal-close" (click)="showAddModal = false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Platform</label>
              <select class="form-input" [(ngModel)]="newPixel.platform">
                <option value="meta">Meta (Facebook/Instagram)</option>
                <option value="google">Google Ads</option>
                <option value="tiktok">TikTok</option>
                <option value="twitter">X (Twitter)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Pixel Name</label>
              <input type="text" class="form-input" [(ngModel)]="newPixel.name" placeholder="e.g. Main Facebook Pixel">
            </div>
            <div class="form-group">
              <label class="form-label">Pixel / Tag ID</label>
              <input type="text" class="form-input" [(ngModel)]="newPixel.pixelId" placeholder="Enter your pixel ID">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="showAddModal = false">Cancel</button>
            <button class="btn-primary" (click)="addPixel()">Add Pixel</button>
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

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
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

    .pixels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 1.25rem;
    }

    .pixel-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      transition: all 0.3s ease;
    }

    .pixel-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    }

    .pixel-card.disabled { opacity: 0.6; }

    .pixel-header {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      margin-bottom: 1.25rem;
    }

    .pixel-platform {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: rgba(59, 130, 246, 0.08);
      flex-shrink: 0;
    }

    .pixel-platform :global(svg) {
      width: 22px;
      height: 22px;
      color: var(--accent-blue);
    }

    .pixel-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .pixel-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .pixel-id {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .pixel-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .pixel-stat {
      display: flex;
      flex-direction: column;
      padding: 0.75rem;
      background: var(--background);
      border-radius: 10px;
    }

    .pixel-stat-value {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .pixel-stat-label {
      font-size: 0.6875rem;
      color: var(--text-muted);
    }

    .pixel-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-light);
    }

    .pixel-status {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .pixel-status.active { color: var(--success); }

    .pixel-delete {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--border-light);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pixel-delete svg { width: 15px; height: 15px; color: var(--text-muted); }

    .pixel-delete:hover {
      background: rgba(239, 68, 68, 0.08);
      border-color: var(--error);
    }

    .pixel-delete:hover svg { color: var(--error); }

    /* Empty State */
    .empty-card {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem;
      background: white;
      border: 2px dashed var(--border-color);
      border-radius: 16px;
      text-align: center;
    }

    .empty-icon {
      width: 56px;
      height: 56px;
      color: var(--text-muted);
      opacity: 0.4;
      margin-bottom: 1.25rem;
    }

    .empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.375rem 0;
    }

    .empty-desc {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0 0 1.25rem 0;
      max-width: 320px;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease-out;
    }

    .modal {
      width: 100%;
      max-width: 480px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.2);
      animation: slideUp 0.3s ease-out;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .modal-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }

    .modal-close {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      border-radius: 8px;
      transition: all 0.2s;
    }

    .modal-close:hover { background: var(--background); }
    .modal-close svg { width: 18px; height: 18px; }

    .modal-body { padding: 1.5rem; }
    .modal-body .form-group { margin-bottom: 1rem; }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border-light);
    }

    .btn-primary.small { padding: 0.75rem 1.5rem; font-size: 0.875rem; }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class PixelsComponent {
  showAddModal = false;

  newPixel = {
    platform: 'meta',
    name: '',
    pixelId: ''
  };

  pixels: TrackingPixel[] = [
    {
      id: '1',
      platform: 'meta',
      name: 'Main Facebook Pixel',
      pixelId: '1234567890123456',
      enabled: true,
      eventsTracked: 2340,
      lastFired: '2 min ago'
    },
    {
      id: '2',
      platform: 'google',
      name: 'Google Ads Tag',
      pixelId: 'AW-1234567890',
      enabled: true,
      eventsTracked: 1890,
      lastFired: '5 min ago'
    },
    {
      id: '3',
      platform: 'tiktok',
      name: 'TikTok Pixel',
      pixelId: 'C5A6B7C8D9E0F1',
      enabled: false,
      eventsTracked: 456,
      lastFired: '2 days ago'
    }
  ];

  getPlatformIcon(platform: string): string {
    const icons: Record<string, string> = {
      'meta': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 1 0 8 0"/></svg>',
      'google': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v10l7 4"/></svg>',
      'tiktok': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="14" r="3"/></svg>',
      'twitter': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>'
    };
    return icons[platform] || icons['meta'];
  }

  addPixel() {
    if (this.newPixel.name && this.newPixel.pixelId) {
      this.pixels.push({
        id: Date.now().toString(),
        platform: this.newPixel.platform,
        name: this.newPixel.name,
        pixelId: this.newPixel.pixelId,
        enabled: true,
        eventsTracked: 0,
        lastFired: 'Never'
      });
      this.newPixel = { platform: 'meta', name: '', pixelId: '' };
      this.showAddModal = false;
    }
  }

  deletePixel(id: string) {
    this.pixels = this.pixels.filter(p => p.id !== id);
  }
}
