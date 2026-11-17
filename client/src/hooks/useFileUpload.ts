import { useState } from 'react';
import axios from 'axios';
import { ragApi } from '../api/ragApi';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadFile = async (files: File[] | FileList): Promise<boolean> => {
    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      await ragApi.ingestFiles(files, (p) => setProgress(p));
      setSuccess(true);
      return true;
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ detail?: string }>(err)
        ? err.response?.data?.detail || err.message
        : err instanceof Error
          ? err.message
          : 'Upload failed';
      setError(message);
      return false;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, progress, error, success };
}