import apiClient from './client';

export interface TimeRange {
    from: string; // ISO date string
    to: string; // ISO date string
}

export const analyticsService = {
    /**
     * Get overall system metrics
     */
    getOverview: async (start?: string, end?: string): Promise<Record<string, any>> => {
        const params = start && end ? { start, end } : {};
        const response = await apiClient.get<Record<string, any>>('/analytics/overview', { params });
        return response.data;
    },

    /**
     * Get detailed activity log
     */
    getActivities: async (page = 1, limit = 20): Promise<{ data: any[], total: number }> => {
        const response = await apiClient.get<{ data: any[], total: number }>('/analytics/activities', {
            params: { page, limit }
        });
        return response.data;
    },

    /**
     * Get specific event type counts (e.g. accepted vs sent)
     */
    getEventStats: async (): Promise<any> => {
        // Assuming a dedicated endpoint or filtered query exists
        const response = await apiClient.get('/analytics/events');
        return response.data;
    }
};
