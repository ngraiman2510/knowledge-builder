import type { SourceChunk } from '../../types/rag';
import { FileText } from 'lucide-react';

interface SourceCardProps {
  source: SourceChunk;
}

export const SourceCard = ({ source }: SourceCardProps) => (
  <div className="source-card">
    <div className="source-card-title">
      <FileText size={14} />
      <span>{source.metadata?.source || 'Source document'}</span>
      {source.metadata?.page && <span className="source-page">p. {source.metadata.page}</span>}
    </div>
    <p>{source.content}</p>
  </div>
);
