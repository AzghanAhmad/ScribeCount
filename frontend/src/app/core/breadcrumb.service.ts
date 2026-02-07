import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private breadcrumbs$ = new BehaviorSubject<BreadcrumbItem[]>([]);

  get breadcrumbs() {
    return this.breadcrumbs$.asObservable();
  }

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.updateBreadcrumbs());
    this.updateBreadcrumbs();
  }

  private updateBreadcrumbs(): void {
    const url = this.router.url;
    const segments = url.split('/').filter(Boolean);
    let items: BreadcrumbItem[] = [{ label: 'Dashboard', url: '/' }];

    if (segments.length === 0) {
      this.breadcrumbs$.next(items);
      return;
    }

    const routeLabels: Record<string, string> = {
      dashboard: 'Dashboard',
      reports: 'Reports',
      'report-viewer': 'Report',
      analytics: 'Analytics',
      attribution: 'Attribution',
      'email-campaigns': 'Email Campaigns',
      forecasting: 'Forecasting',
      alerts: 'Alerts & Monitoring',
      'saved-questions': 'Saved Questions',
      'scheduled-briefings': 'Scheduled Briefings',
      history: 'Assistant History',
      settings: 'Settings',
      integrations: 'Integrations',
      'api-access': 'API Access',
      'audit-logs': 'Audit Logs'
    };

    let path = '';
    for (let i = 0; i < segments.length; i++) {
      path += '/' + segments[i];
      const key = segments[i].toLowerCase();
      const label = routeLabels[key] ?? segments[i];
      items.push({ label, url: i === segments.length - 1 ? undefined : path });
    }
    if (items.length === 2 && items[0].label === items[1].label) {
      items = [items[1]];
    }
    this.breadcrumbs$.next(items);
  }
}
