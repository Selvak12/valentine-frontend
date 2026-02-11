export type InvitationStatus = 'Sent' | 'Opened' | 'Accepted' | 'Declined';

export interface Recipient {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    status: InvitationStatus;
    lastActive: string;
    message?: string;
    images?: string[];
    tone?: string;
}

export interface InvitationData {
    name: string;
    email: string;
    message: string;
    images?: string[];
    tone?: string;
}
