import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AssistantService } from '../../assistant/assistant.service';
import { SidebarService } from '../../core/sidebar.service';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  action?: string;
  badge?: string;
  badgeType?: 'info' | 'success' | 'warning' | 'error';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <!-- Collapse Toggle -->
      <button type="button" class="collapse-btn" (click)="toggleCollapse()" aria-label="Toggle sidebar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.rotated]="collapsed">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <!-- Navigation Sections -->
      <div class="nav-wrapper">
        <nav *ngFor="let section of navSections; let i = index" 
             class="nav" 
             [attr.aria-label]="section.title"
             [style.animationDelay]="(i * 0.05) + 's'">
          <span class="nav-section-label" *ngIf="!collapsed">{{ section.title }}</span>
          
          <ng-container *ngFor="let item of section.items">
            <!-- Regular Nav Item -->
            <a *ngIf="item.route" 
               [routerLink]="item.route" 
               routerLinkActive="active" 
               [routerLinkActiveOptions]="{exact: item.route === '/dashboard'}"
               class="nav-item">
              <div class="nav-icon" [innerHTML]="item.icon"></div>
              <span class="nav-text">{{ item.label }}</span>
              <span *ngIf="item.badge" 
                    class="nav-badge" 
                    [class.info]="item.badgeType === 'info'"
                    [class.success]="item.badgeType === 'success'"
                    [class.warning]="item.badgeType === 'warning'"
                    [class.error]="item.badgeType === 'error'">
                {{ item.badge }}
              </span>
              <span class="nav-highlight"></span>
            </a>
            
            <!-- Action Nav Item (Hey ScribeCount) -->
            <a *ngIf="item.action === 'assistant'" 
               href="#" 
               class="nav-item nav-item-special"
               (click)="$event.preventDefault(); openAssistant()">
              <div class="nav-icon special-icon" [innerHTML]="item.icon"></div>
              <span class="nav-text">{{ item.label }}</span>
              <span class="sparkle-effect"></span>
              <span class="nav-highlight"></span>
            </a>
          </ng-container>
        </nav>
      </div>

      <!-- Bottom Section -->
      <div class="sidebar-footer" *ngIf="!collapsed">
        <div class="usage-card">
          <div class="usage-header">
            <span class="usage-label">API Calls This Month</span>
            <span class="usage-value">2,847 / 5,000</span>
          </div>
          <div class="usage-bar">
            <div class="usage-progress" style="width: 57%"></div>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
      width: 250px;
      flex-shrink: 0;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sidebar {
      position: fixed;
      top: 64px;
      left: 0;
      bottom: 0;
      width: 250px;
      background: linear-gradient(180deg, rgb(28, 46, 74) 0%, rgb(18, 30, 48) 100%);
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      overflow: hidden;
      z-index: 900;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }

    .sidebar.collapsed {
      width: 80px;
    }

    :host-context(.sidebar-collapsed) {
      width: 80px;
    }

    .sidebar.collapsed .nav-text,
    .sidebar.collapsed .nav-section-label,
    .sidebar.collapsed .nav-badge {
      opacity: 0;
      visibility: hidden;
    }

    .sidebar.collapsed .nav-item {
      justify-content: center;
      padding: 0.75rem;
    }
    
    .sidebar.collapsed .nav-icon {
      margin: 0;
    }

    /* Collapse Button */
    .collapse-btn {
      position: absolute;
      right: -14px;
      top: 1.5rem;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: white;
      border: none;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: all 0.25s ease;
    }

    .collapse-btn:hover {
      background: var(--background);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transform: scale(1.1);
    }

    .collapse-btn svg {
      width: 16px;
      height: 16px;
      color: var(--primary);
      transition: transform 0.3s ease;
    }

    .collapse-btn svg.rotated {
      transform: rotate(180deg);
    }

    /* Navigation */
    .nav-wrapper {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding-bottom: 1rem;
    }

    .nav {
      padding: 1.25rem 0 0.5rem;
      animation: fadeInUp 0.4s ease-out backwards;
    }

    .nav-section-label {
      display: block;
      padding: 0 1.25rem 0.75rem;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.35);
      transition: opacity 0.2s;
    }

    .nav-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0.75rem 1.25rem;
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      margin: 0 0.5rem;
      border-radius: 10px;
      font-size: 0.9375rem;
      font-weight: 500;
      overflow: hidden;
    }

    .nav-item:hover {
      color: white;
      background: rgba(255, 255, 255, 0.08);
    }

    .nav-item.active {
      color: white;
      background: rgba(255, 255, 255, 0.12);
    }

    .nav-item.active .nav-highlight {
      opacity: 1;
    }

    .nav-highlight {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: linear-gradient(180deg, #60a5fa 0%, #a78bfa 100%);
      border-radius: 0 2px 2px 0;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      flex-shrink: 0;
      transition: transform 0.2s;
    }

    .nav-item:hover .nav-icon {
      transform: scale(1.1);
    }

    .nav-icon :global(svg) {
      width: 100%;
      height: 100%;
    }

    .nav-text {
      flex: 1;
      white-space: nowrap;
      transition: opacity 0.2s;
    }

    .nav-badge {
      padding: 0.125rem 0.5rem;
      font-size: 0.6875rem;
      font-weight: 600;
      border-radius: 100px;
      background: rgba(255, 255, 255, 0.15);
      color: white;
      transition: opacity 0.2s;
    }

    .nav-badge.info {
      background: rgba(59, 130, 246, 0.3);
      color: #93c5fd;
    }

    .nav-badge.success {
      background: rgba(16, 185, 129, 0.3);
      color: #6ee7b7;
    }

    .nav-badge.warning {
      background: rgba(245, 158, 11, 0.3);
      color: #fcd34d;
    }

    .nav-badge.error {
      background: rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }

    /* Special Nav Item (Hey ScribeCount) */
    .nav-item-special {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
      border: 1px solid rgba(139, 92, 246, 0.3);
      margin-top: 0.5rem;
    }

    .nav-item-special:hover {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
      border-color: rgba(139, 92, 246, 0.5);
    }

    .special-icon {
      color: #a78bfa;
    }

    .sparkle-effect {
      position: absolute;
      top: 50%;
      right: 1rem;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      background: #a78bfa;
      border-radius: 50%;
      animation: sparkle 2s infinite;
    }

    @keyframes sparkle {
      0%, 100% { opacity: 0.4; transform: translateY(-50%) scale(1); }
      50% { opacity: 1; transform: translateY(-50%) scale(1.3); }
    }

    /* Sidebar Footer */
    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .usage-card {
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .usage-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .usage-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.6);
    }

    .usage-value {
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
    }

    .usage-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
    }

    .usage-progress {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
      border-radius: 3px;
      transition: width 0.5s ease;
    }

    /* Scrollbar */
    .nav-wrapper::-webkit-scrollbar {
      width: 4px;
    }

    .nav-wrapper::-webkit-scrollbar-track {
      background: transparent;
    }

    .nav-wrapper::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 2px;
    }

    .nav-wrapper::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class SidebarComponent {
  collapsed = false;

  navSections: NavSection[] = [
    {
      title: 'Core Analytics',
      items: [
        {
          label: 'Dashboard',
          route: '/dashboard',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>'
        },
        {
          label: 'Reports',
          route: '/reports',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
          badge: '3',
          badgeType: 'info'
        },
        {
          label: 'Analytics',
          route: '/analytics',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
        },
        {
          label: 'Attribution',
          route: '/attribution',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>'
        }
      ]
    },
    {
      title: 'Marketing',
      items: [
        {
          label: 'Email Campaigns',
          route: '/email-campaigns',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
          badge: 'New',
          badgeType: 'success'
        },
        {
          label: 'Forecasting',
          route: '/forecasting',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>'
        },
        {
          label: 'Alerts & Monitoring',
          route: '/alerts',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
          badge: '2',
          badgeType: 'warning'
        }
      ]
    },
    {
      title: 'Assistant',
      items: [
        {
          label: 'Hey ScribeCount?',
          action: 'assistant',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>'
        },
        {
          label: 'Saved Questions',
          route: '/saved-questions',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
        },
        {
          label: 'Scheduled Briefings',
          route: '/scheduled-briefings',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
        },
        {
          label: 'History',
          route: '/history',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/></svg>'
        }
      ]
    },
    {
      title: 'System',
      items: [
        {
          label: 'Settings',
          route: '/settings',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
        },
        {
          label: 'Integrations',
          route: '/integrations',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
        },
        {
          label: 'API Access',
          route: '/api-access',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
        },
        {
          label: 'Audit Logs',
          route: '/audit-logs',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>'
        }
      ]
    }
  ];

  constructor(
    private assistant: AssistantService,
    private sidebarService: SidebarService
  ) {
    this.sidebarService.collapsed.subscribe(c => (this.collapsed = c));
  }

  toggleCollapse(): void {
    this.sidebarService.toggle();
  }

  openAssistant(): void {
    this.assistant.openPanel();
  }
}
