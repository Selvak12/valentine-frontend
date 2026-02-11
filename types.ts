
export type InvitationStatus = 'Sent' | 'Opened' | 'Accepted' | 'Declined';

export interface Recipient {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  status: InvitationStatus;
  dateSent: string;
  lastActive: string;
  message?: string;
  images?: string[]; // Added for memory gallery
  tone?: string;
}

export interface InvitationData {
  name: string;
  email: string;
  message: string;
  images?: string[];
  tone?: string;
}
