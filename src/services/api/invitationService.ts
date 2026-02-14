import apiClient from './client';
import type {
    Invitation,
    InvitationData,
    InvitationStats,
    InvitationFilters,
    Pagination,
} from '../../types/invitation';

export interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
}

export const invitationService = {
    /**
     * Create a new invitation
     */
    create: async (data: InvitationData): Promise<Invitation> => {
        const response = await apiClient.post<{ success: boolean; data: Invitation }>('/invitations', data);
        // Backend returns {success: true, data: {...}}
        return response.data.data;
    },

    /**
     * Get all invitations with optional filters
     */
    getAll: async (
        filters?: InvitationFilters,
        page: number = 1,
        limit: number = 10
    ): Promise<PaginatedResponse<Invitation>> => {
        const params = {
            ...filters,
            page,
            limit,
        };
        const response = await apiClient.get<PaginatedResponse<Invitation>>('/invitations', {
            params,
        });
        return response.data;
    },

    /**
     * Get invitation by ID
     */
    getById: async (id: string): Promise<Invitation> => {
        const response = await apiClient.get<any>(`/invitations/${id}`);
        return response.data.data || response.data;
    },

    /**
     * Get invitation by short code (public endpoint)
     */
    getByShortCode: async (shortCode: string): Promise<Invitation> => {
        const response = await apiClient.get<any>(`/track/${shortCode}`);
        // Handle both wrapped and unwrapped responses
        return response.data.data || response.data;
    },

    /**
     * Update invitation
     */
    update: async (id: string, data: Partial<InvitationData>): Promise<Invitation> => {
        const response = await apiClient.put<Invitation>(`/invitations/${id}`, data);
        return response.data;
    },

    /**
     * Delete invitation
     */
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/invitations/${id}`);
    },

    /**
     * Send invitation email
     */
    send: async (id: string): Promise<Invitation> => {
        const response = await apiClient.post<{ success: boolean; data: Invitation }>(`/invitations/${id}/send`);
        // Backend returns {success: true, data: {...}}
        return response.data.data;
    },

    /**
     * Get invitation statistics
     */
    getStats: async (): Promise<InvitationStats> => {
        const response = await apiClient.get<InvitationStats>('/analytics/overview');
        return response.data;
    },

    /**
     * Resend invitation
     */
    resend: async (id: string): Promise<Invitation> => {
        const response = await apiClient.post<Invitation>(`/invitations/${id}/send`);
        return response.data;
    },
};
