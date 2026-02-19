import { Injectable, signal } from '@angular/core';
import { UserSettings } from '../models/smart-link.model';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    private settings = signal<UserSettings>({
        defaultRoutingBehavior: 'geo-routing',
        defaultCountryFallback: 'US',
        defaultFormatPreference: 'auto',
        metaPixelId: '',
        googleTagId: '',
        enableBridgePage: false,
        accountName: 'Sarah Mitchell',
        accountEmail: 'sarah@authorflow.com'
    });

    readonly currentSettings = this.settings.asReadonly();

    updateSettings(partial: Partial<UserSettings>) {
        this.settings.update(s => ({ ...s, ...partial }));
    }
}
