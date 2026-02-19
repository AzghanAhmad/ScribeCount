import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AssistantButtonComponent } from '../assistant/assistant-button.component';
import { AssistantPanelComponent } from '../assistant/assistant-panel.component';
import { SidebarService } from '../core/sidebar.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    AssistantButtonComponent,
    AssistantPanelComponent
  ],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <div class="main-wrapper" [class.sidebar-collapsed]="sidebarCollapsed">
        <app-sidebar></app-sidebar>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>

      <app-assistant-button></app-assistant-button>
      <app-assistant-panel></app-assistant-panel>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      overflow: hidden;
      background: var(--background);
    }

    .main-wrapper {
      display: flex;
      flex: 1;
      overflow: hidden;
      padding-top: 64px;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      background: var(--background);
      padding: 0;
      margin-left: 0Attribution
Understand which marketing efforts drive your sales

Attribution Model:

Last Touch
Run Attributionpx;
      transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .main-wrapper.sidebar-collapsed .content {
      margin-left: 80px;
    }

    /* Custom scrollbar for content area */
    .content::-webkit-scrollbar {
      width: 8px;
    }

    .content::-webkit-scrollbar-track {
      background: transparent;
    }

    .content::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }

    .content::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 1024px) {
      .content {
        padding: 0;
      }
    }

    @media (max-width: 768px) {
      .content {
        margin-left: 0;
        padding: 0;
      }
    }
  `]
})
export class LayoutComponent implements OnInit {
  sidebarCollapsed = false;

  constructor(private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.sidebarService.collapsed.subscribe(c => (this.sidebarCollapsed = c));
  }
}
