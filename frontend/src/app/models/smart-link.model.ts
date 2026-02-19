export interface SmartLink {
    id: string;
    bookTitle: string;
    authorName?: string;
    coverUrl: string;
    shortUrl: string;
    totalClicks: number;
    status: 'active' | 'scheduled' | 'expired';
    createdAt: Date;
    releaseDate?: Date;
    isPreorder: boolean;
    formats: BookFormat[];
    retailers: RetailerLink[];
    routingRules: RoutingRule[];
    campaigns: CampaignTracking[];
    landingPageEnabled: boolean;
    autoSelectFormat: boolean;
    expirationDate?: Date;
    promotionRedirect?: PromotionRedirect;
    autoSwitch?: AutoSwitch;
    brokenLinkStatus?: RetailerHealth[];
}

export interface BookFormat {
    type: 'ebook' | 'paperback' | 'hardcover' | 'audiobook';
    price: number;
    currency: string;
    selected?: boolean;
}

export interface RetailerLink {
    id: string;
    name: string;
    url: string;
    countryCode: string;
    available: boolean;
    priority: number;
    icon: string;
}

export interface RoutingRule {
    id: string;
    conditionType: 'country' | 'device' | 'format' | 'custom';
    conditionValue: string;
    action: string;
    priority: number;
}

export interface CampaignTracking {
    id: string;
    name: string;
    source: string;
    medium: string;
    utmEnabled: boolean;
    clicks: number;
    generatedUrl?: string;
}

export interface PromotionRedirect {
    enabled: boolean;
    url: string;
    startDate?: string;
    endDate?: string;
}

export interface AutoSwitch {
    enabled: boolean;
    preorderUrl: string;
    liveUrl: string;
    switchDate: string;
}

export interface DashboardStats {
    totalLinks: number;
    totalClicks: number;
    topCountry: string;
    topRetailer: string;
}

export interface AnalyticsData {
    totalClicks: number;
    countries: { country: string; clicks: number; percentage: number }[];
    retailers: { retailer: string; clicks: number; percentage: number }[];
    devices: { device: string; clicks: number; percentage: number }[];
    campaigns: CampaignAnalytics[];
    clicksByDay: { date: string; clicks: number }[];
}

export interface CampaignAnalytics {
    source: string;
    campaign: string;
    country: string;
    retailer: string;
    clicks: number;
}

export interface UserSettings {
    defaultRoutingBehavior: string;
    defaultCountryFallback: string;
    defaultFormatPreference: string;
    metaPixelId: string;
    googleTagId: string;
    enableBridgePage: boolean;
    accountName: string;
    accountEmail: string;
}

export interface RetailerHealth {
    retailer: string;
    status: 'healthy' | 'warning' | 'down';
    lastCheck: string;
    responseTime: string;
}
