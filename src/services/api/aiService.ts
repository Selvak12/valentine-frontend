import apiClient from './client';

export interface GenerateMessageRequest {
    recipientName: string;
    relationship: string;
    tone: 'romantic' | 'funny' | 'poetic' | 'casual';
    extras?: string;
}

export interface GenerateMessageResponse {
    message: string;
}

export const aiService = {
    /**
     * Generate an AI-powered Valentine's message
     */
    generateMessage: async (data: GenerateMessageRequest): Promise<GenerateMessageResponse> => {
        const response = await apiClient.post<GenerateMessageResponse>('/ai/generate-message', data);
        return response.data;
    },
};
