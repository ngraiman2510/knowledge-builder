import { httpClient } from './httpClient';
import type { ChatRequest, ChatResponse, IngestionResponse } from '../types/rag';

export const ragApi = {
  ingestFiles: async (
    files: FileList | File[],
    onProgress?: (progress: number) => void,
  ): Promise<IngestionResponse> => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file); // Note: match your FastAPI backend parameter name (e.g., 'files')
    });

    const response = await httpClient.post<IngestionResponse>('/ingest', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },

  chat: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await httpClient.post<ChatResponse>('/chat', request);
    return response.data;
  },
};