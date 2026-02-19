import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateLinkComponent } from './pages/create-link/create-link.component';
import { EditLinkComponent } from './pages/edit-link/edit-link.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { PixelsComponent } from './pages/pixels/pixels.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'create', component: CreateLinkComponent },
    { path: 'edit/:id', component: EditLinkComponent },
    { path: 'analytics/:id', component: AnalyticsComponent },
    { path: 'pixels', component: PixelsComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '**', redirectTo: 'dashboard' }
];
