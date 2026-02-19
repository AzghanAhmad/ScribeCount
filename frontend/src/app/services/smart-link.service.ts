import { Injectable, signal, computed } from '@angular/core';
import {
    SmartLink,
    DashboardStats,
    AnalyticsData,
    RetailerHealth,
    CampaignAnalytics
} from '../models/smart-link.model';

@Injectable({ providedIn: 'root' })
export class SmartLinkService {
    private smartLinks = signal<SmartLink[]>(this.generateMockLinks());

    readonly links = this.smartLinks.asReadonly();

    readonly dashboardStats = computed<DashboardStats>(() => {
        const links = this.smartLinks();
        return {
            totalLinks: links.length,
            totalClicks: links.reduce((sum, l) => sum + l.totalClicks, 0),
            topCountry: 'United States',
            topRetailer: 'Amazon'
        };
    });

    addLink(link: SmartLink): void {
        this.smartLinks.update(links => [link, ...links]);
    }

    updateLink(updated: SmartLink): void {
        this.smartLinks.update(links =>
            links.map(l => l.id === updated.id ? updated : l)
        );
    }

    deleteLink(id: string): void {
        this.smartLinks.update(links => links.filter(l => l.id !== id));
    }

    getLink(id: string): SmartLink | undefined {
        return this.smartLinks().find(l => l.id === id);
    }

    getAnalytics(linkId: string): AnalyticsData {
        return {
            totalClicks: 12847,
            countries: [
                { country: 'United States', clicks: 5420, percentage: 42 },
                { country: 'United Kingdom', clicks: 2310, percentage: 18 },
                { country: 'Canada', clicks: 1540, percentage: 12 },
                { country: 'Australia', clicks: 1150, percentage: 9 },
                { country: 'Germany', clicks: 890, percentage: 7 },
                { country: 'Other', clicks: 1537, percentage: 12 }
            ],
            retailers: [
                { retailer: 'Amazon', clicks: 6423, percentage: 50 },
                { retailer: 'Apple Books', clicks: 2570, percentage: 20 },
                { retailer: 'Kobo', clicks: 1927, percentage: 15 },
                { retailer: 'Barnes & Noble', clicks: 1285, percentage: 10 },
                { retailer: 'Google Play', clicks: 642, percentage: 5 }
            ],
            devices: [
                { device: 'Mobile', clicks: 7708, percentage: 60 },
                { device: 'Desktop', clicks: 3856, percentage: 30 },
                { device: 'Tablet', clicks: 1283, percentage: 10 }
            ],
            campaigns: [
                { source: 'Facebook', campaign: 'release_promo', country: 'US', retailer: 'Amazon', clicks: 3200 },
                { source: 'Instagram', campaign: 'story_swipe', country: 'US', retailer: 'Apple Books', clicks: 2100 },
                { source: 'Email', campaign: 'newsletter_launch', country: 'UK', retailer: 'Amazon UK', clicks: 1800 },
                { source: 'TikTok', campaign: 'booktok_viral', country: 'US', retailer: 'Amazon', clicks: 4500 },
                { source: 'Blog', campaign: 'guest_post', country: 'CA', retailer: 'Kobo', clicks: 1247 }
            ],
            clicksByDay: this.generateClicksByDay()
        };
    }

    getRetailerHealth(): RetailerHealth[] {
        return [
            { retailer: 'Amazon US', status: 'healthy', lastCheck: '2 min ago', responseTime: '120ms' },
            { retailer: 'Amazon UK', status: 'healthy', lastCheck: '2 min ago', responseTime: '145ms' },
            { retailer: 'Apple Books', status: 'healthy', lastCheck: '3 min ago', responseTime: '98ms' },
            { retailer: 'Kobo', status: 'warning', lastCheck: '5 min ago', responseTime: '890ms' },
            { retailer: 'Barnes & Noble', status: 'healthy', lastCheck: '1 min ago', responseTime: '210ms' },
            { retailer: 'Google Play', status: 'down', lastCheck: '10 min ago', responseTime: 'N/A' }
        ];
    }

    private generateClicksByDay(): { date: string; clicks: number }[] {
        const days: { date: string; clicks: number }[] = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            days.push({
                date: date.toISOString().split('T')[0],
                clicks: Math.floor(Math.random() * 500) + 100
            });
        }
        return days;
    }

    private generateMockLinks(): SmartLink[] {
        return [
            {
                id: '1',
                bookTitle: 'The Midnight Garden',
                authorName: 'Sarah Mitchell',
                coverUrl: '',
                shortUrl: 'https://sc.link/midnight-garden',
                totalClicks: 4523,
                status: 'active',
                createdAt: new Date('2025-12-01'),
                isPreorder: false,
                formats: [
                    { type: 'ebook', price: 4.99, currency: 'USD' },
                    { type: 'paperback', price: 14.99, currency: 'USD' },
                    { type: 'audiobook', price: 19.99, currency: 'USD' }
                ],
                retailers: [
                    { id: 'r1', name: 'Amazon US', url: 'https://amazon.com/dp/B0xxxx', countryCode: 'US', available: true, priority: 1, icon: 'amazon' },
                    { id: 'r2', name: 'Amazon UK', url: 'https://amazon.co.uk/dp/B0xxxx', countryCode: 'UK', available: true, priority: 2, icon: 'amazon' },
                    { id: 'r3', name: 'Apple Books', url: 'https://books.apple.com/xxxx', countryCode: 'US', available: true, priority: 3, icon: 'apple' },
                    { id: 'r4', name: 'Kobo', url: 'https://kobo.com/xxxx', countryCode: 'US', available: true, priority: 4, icon: 'kobo' }
                ],
                routingRules: [
                    { id: 'rr1', conditionType: 'country', conditionValue: 'UK', action: 'Route to Amazon UK', priority: 1 },
                    { id: 'rr2', conditionType: 'country', conditionValue: 'Canada', action: 'Route to Kobo', priority: 2 },
                    { id: 'rr3', conditionType: 'device', conditionValue: 'iOS', action: 'Prioritize Apple Books', priority: 3 }
                ],
                campaigns: [
                    { id: 'c1', name: 'Launch Week', source: 'email', medium: 'newsletter', utmEnabled: true, clicks: 1200 },
                    { id: 'c2', name: 'Social Push', source: 'instagram', medium: 'story', utmEnabled: true, clicks: 890 }
                ],
                landingPageEnabled: true,
                autoSelectFormat: true
            },
            {
                id: '2',
                bookTitle: 'Shadows of Tomorrow',
                authorName: 'Sarah Mitchell',
                coverUrl: '',
                shortUrl: 'https://sc.link/shadows-tomorrow',
                totalClicks: 2891,
                status: 'active',
                createdAt: new Date('2025-11-15'),
                isPreorder: false,
                formats: [
                    { type: 'ebook', price: 3.99, currency: 'USD' },
                    { type: 'paperback', price: 12.99, currency: 'USD' }
                ],
                retailers: [
                    { id: 'r1', name: 'Amazon US', url: 'https://amazon.com/dp/B0yyyy', countryCode: 'US', available: true, priority: 1, icon: 'amazon' },
                    { id: 'r2', name: 'Barnes & Noble', url: 'https://bn.com/xxxx', countryCode: 'US', available: true, priority: 2, icon: 'bn' }
                ],
                routingRules: [
                    { id: 'rr1', conditionType: 'country', conditionValue: 'US', action: 'Route to Amazon US', priority: 1 }
                ],
                campaigns: [],
                landingPageEnabled: true,
                autoSelectFormat: false
            },
            {
                id: '3',
                bookTitle: 'Crown of Embers',
                authorName: 'Sarah Mitchell',
                coverUrl: '',
                shortUrl: 'https://sc.link/crown-embers',
                totalClicks: 756,
                status: 'scheduled',
                createdAt: new Date('2026-01-10'),
                releaseDate: new Date('2026-03-15'),
                isPreorder: true,
                formats: [
                    { type: 'ebook', price: 5.99, currency: 'USD' },
                    { type: 'hardcover', price: 24.99, currency: 'USD' }
                ],
                retailers: [
                    { id: 'r1', name: 'Amazon US', url: 'https://amazon.com/dp/B0zzzz', countryCode: 'US', available: true, priority: 1, icon: 'amazon' }
                ],
                routingRules: [],
                campaigns: [],
                landingPageEnabled: false,
                autoSelectFormat: true,
                autoSwitch: {
                    enabled: true,
                    preorderUrl: 'https://amazon.com/dp/B0zzzz-preorder',
                    liveUrl: 'https://amazon.com/dp/B0zzzz',
                    switchDate: '2026-03-15'
                }
            },
            {
                id: '4',
                bookTitle: 'Whispers in the Dark',
                authorName: 'Sarah Mitchell',
                coverUrl: '',
                shortUrl: 'https://sc.link/whispers-dark',
                totalClicks: 8234,
                status: 'active',
                createdAt: new Date('2025-06-20'),
                isPreorder: false,
                formats: [
                    { type: 'ebook', price: 2.99, currency: 'USD' },
                    { type: 'paperback', price: 11.99, currency: 'USD' },
                    { type: 'audiobook', price: 14.99, currency: 'USD' }
                ],
                retailers: [
                    { id: 'r1', name: 'Amazon US', url: 'https://amazon.com/dp/B0aaaa', countryCode: 'US', available: true, priority: 1, icon: 'amazon' },
                    { id: 'r2', name: 'Amazon CA', url: 'https://amazon.ca/dp/B0aaaa', countryCode: 'CA', available: true, priority: 2, icon: 'amazon' },
                    { id: 'r3', name: 'Kobo', url: 'https://kobo.com/yyyy', countryCode: 'US', available: true, priority: 3, icon: 'kobo' },
                    { id: 'r4', name: 'Google Play', url: 'https://play.google.com/xxxx', countryCode: 'US', available: true, priority: 4, icon: 'google' }
                ],
                routingRules: [
                    { id: 'rr1', conditionType: 'country', conditionValue: 'Canada', action: 'Route to Amazon CA', priority: 1 },
                    { id: 'rr2', conditionType: 'device', conditionValue: 'Android', action: 'Route to Google Play', priority: 2 }
                ],
                campaigns: [
                    { id: 'c1', name: 'BookBub Deal', source: 'bookbub', medium: 'featured', utmEnabled: true, clicks: 4500 }
                ],
                landingPageEnabled: true,
                autoSelectFormat: true
            },
            {
                id: '5',
                bookTitle: 'The Last Enchantment',
                authorName: 'Sarah Mitchell',
                coverUrl: '',
                shortUrl: 'https://sc.link/last-enchantment',
                totalClicks: 312,
                status: 'expired',
                createdAt: new Date('2025-03-01'),
                expirationDate: new Date('2025-09-01'),
                isPreorder: false,
                formats: [
                    { type: 'ebook', price: 0.99, currency: 'USD' }
                ],
                retailers: [
                    { id: 'r1', name: 'Amazon US', url: 'https://amazon.com/dp/B0bbbb', countryCode: 'US', available: true, priority: 1, icon: 'amazon' }
                ],
                routingRules: [],
                campaigns: [],
                landingPageEnabled: false,
                autoSelectFormat: false
            }
        ];
    }
}
