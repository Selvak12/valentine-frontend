import apiClient from './client';

export interface UploadResponse {
    url: string;
    publicId: string;
    format: string;
    bytes: number;
}

export const mediaService = {
    /**
     * Upload an image/media file
     */
    upload: async (file: File): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<UploadResponse>('/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000, // Longer timeout for large files
        });
        return response.data;
    },

    /**
     * Delete a media file (if supported by backend)
     */
    delete: async (publicId: string): Promise<void> => {
        // Optional endpoint if implemented in backend
        await apiClient.delete(`/media/${publicId}`);
    }
};
