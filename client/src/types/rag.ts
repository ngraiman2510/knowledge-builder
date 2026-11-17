export interface SourceChunk {
  id?: string;
  content: string;
  metadata: {
    source?: string;
    page?: number;
    [key: string]: unknown;
  };
}

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer: string;
  sources: SourceChunk[];
}

export interface IngestionResponse {
  status: string;
  message: string;
  total_chunks: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceChunk[];
}