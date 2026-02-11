export interface InvitationData {
    recipientName: string;
    recipientEmail: string;
    message: string;
    images?: string[];
    songUrl?: string;
    enableButtonEvasion?: boolean;
    enableAutoAdvance?: boolean;
    musicAutoPlay?: boolean;
}

export interface Invitation extends InvitationData {
    _id: string;
    shortCode: string;
    status: 'sent' | 'opened' | 'accepted';
    adminId: string;
    dateSent: string;
    dateOpened?: string;
    dateAccepted?: string;
    createdAt: string;
    updatedAt: string;
}

export interface InvitationStats {
    totalInvitations: number;
    sent: number;
    opened: number;
    accepted: number;
    openRate: number;
    acceptanceRate: number;
}

export interface InvitationFilters {
    status?: 'sent' | 'opened' | 'accepted';
    searchQuery?: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
