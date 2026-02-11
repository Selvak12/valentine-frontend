export interface ActivityEvent {
    id: string;
    type: 'invitation_sent' | 'link_opened' | 'proposal_accepted' | 'page_view' | 'interaction';
    invitationId: string;
    recipientName: string;
    recipientEmail: string;
    timestamp: string;
    metadata?: Record<string, any>;
}

export interface AnalyticsMetrics {
    totalInvitations: number;
    totalOpened: number;
    totalAccepted: number;
    openRate: number;
    acceptanceRate: number;
    averageTimeToOpen?: number;
    averageTimeToAccept?: number;
}

export interface TimeSeriesPoint {
    date: string;
    sent: number;
    opened: number;
    accepted: number;
}

export interface DeviceData {
    device: 'mobile' | 'tablet' | 'desktop';
    count: number;
    percentage: number;
}

export interface TrackingData {
    invitationId: string;
    sessionId: string;
    page?: string;
    event?: string;
    timestamp: string;
    userAgent?: string;
    screenSize?: string;
    metadata?: Record<string, any>;
}
