import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, Routes } from '@angular/router';
import { LayoutComponent } from './app/layout/layout.component';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { ReportsListComponent } from './app/pages/reports/reports-list.component';
import { ReportViewerComponent } from './app/pages/reports/report-viewer.component';
import { AnalyticsComponent } from './app/pages/analytics/analytics.component';
import { AttributionComponent } from './app/pages/attribution/attribution.component';
import { EmailCampaignsComponent } from './app/pages/email-campaigns/email-campaigns.component';
import { ForecastingComponent } from './app/pages/forecasting/forecasting.component';
import { AlertsComponent } from './app/pages/alerts/alerts.component';
import { SavedQuestionsComponent } from './app/pages/saved-questions/saved-questions.component';
import { ScheduledBriefingsComponent } from './app/pages/scheduled-briefings/scheduled-briefings.component';
import { HistoryComponent } from './app/pages/history/history.component';
import { SettingsComponent } from './app/pages/settings/settings.component';
import { IntegrationsComponent } from './app/pages/integrations/integrations.component';
import { ApiAccessComponent } from './app/pages/api-access/api-access.component';
import { AuditLogsComponent } from './app/pages/audit-logs/audit-logs.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reports', component: ReportsListComponent },
      { path: 'reports/:id', component: ReportViewerComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'attribution', component: AttributionComponent },
      { path: 'email-campaigns', component: EmailCampaignsComponent },
      { path: 'forecasting', component: ForecastingComponent },
      { path: 'alerts', component: AlertsComponent },
      { path: 'saved-questions', component: SavedQuestionsComponent },
      { path: 'scheduled-briefings', component: ScheduledBriefingsComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'integrations', component: IntegrationsComponent },
      { path: 'api-access', component: ApiAccessComponent },
      { path: 'audit-logs', component: AuditLogsComponent }
    ]
  }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class App { }

bootstrapApplication(App, {
  providers: [
    provideRouter(routes)
  ]
});
