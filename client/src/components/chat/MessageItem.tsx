import type { ChatMessage } from '../../types/rag';
import { SourceCard } from './SourceCard';
import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageItemProps {
  message: ChatMessage;
}

export const MessageItem = ({ message }: MessageItemProps) => {
  const isUser = message.role === 'user';

  return (
    <article className={`message-row ${isUser ? 'message-user' : 'message-assistant'}`}>
      {!isUser && <div className="assistant-avatar"><Sparkles size={15} /></div>}
      <div className="message-content">
        <p className="message-author">{isUser ? 'You' : 'Knowledge assistant'}</p>
        <div className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
        {!isUser && message.sources?.length === 0 && (
          <p className="no-sources-note">No supporting documents were retrieved for this response.</p>
        )}
        {message.sources && message.sources.length > 0 && (
          <div className="sources-section">
            <p className="sources-heading">Sources</p>
            <div className="sources-grid">
              {message.sources.map((source, index) => (
                <SourceCard key={source.id ?? `${source.metadata?.source ?? 'source'}-${index}`} source={source} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
