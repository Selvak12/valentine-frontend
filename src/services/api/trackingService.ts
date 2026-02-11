import apiClient from './client';

export const trackingService = {
    /**
     * Records a page view event.
     * @param data - Optional data related to the page view (e.g., path, user agent).
     * @param isAlias - If true, uses the /api/invite alias endpoint.
     */
    recordPageView: async (data: { invitationId: string } & Record<string, any>, isAlias = false): Promise<void> => {
        const endpoint = isAlias ? '/invite/pageview' : '/track/pageview';
        await apiClient.post(endpoint, data);
    },

    /**
     * Records an interaction event.
     * @param data - Data related to the interaction (e.g., element clicked, duration).
     * @param isAlias - If true, uses the /api/invite alias endpoint.
     */
    recordInteraction: async (data: Record<string, any>, isAlias = false): Promise<void> => {
        const endpoint = isAlias ? '/invite/interaction' : '/track/interaction';
        await apiClient.post(endpoint, data);
    },

    /**
     * Records an acceptance event.
     * @param data - Data related to the acceptance (e.g., invitationId).
     * @param isAlias - If true, uses the /api/invite alias endpoint.
     */
    recordAcceptance: async (data: Record<string, any>, isAlias = false): Promise<void> => {
        const endpoint = isAlias ? '/invite/accept' : '/track/accept';
        await apiClient.post(endpoint, data);
    },

    /**
     * Get an invitation via short code (public endpoint).
     * @param shortCode - The unique short code.
     * @param isAlias - If true, uses the /api/invite alias endpoint.
     */
    getByShortCode: async (shortCode: string, isAlias = false): Promise<any> => {
        const endpoint = isAlias ? `/invite/${shortCode}` : `/track/${shortCode}`;
        const response = await apiClient.get<any>(endpoint);
        return response.data;
    },
};
