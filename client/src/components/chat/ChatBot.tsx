import { useState, useRef, useEffect, type FormEvent } from 'react';
import { MessageItem } from './MessageItem';
import { useChatStream } from '../../hooks/useChatStream';
import { ArrowUp, LoaderCircle, Sparkles } from 'lucide-react';
import { CHAT_SUGGESTIONS } from './constants';

export const ChatBot = () => {
  const { messages, sendMessage, loading } = useChatStream();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const updateInput = (value: string) => {
    setInput(value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input);
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  return (
    <section className="chat-panel" aria-label="Chat">
      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="welcome-state">
            <div className="welcome-icon"><Sparkles size={24} /></div>
            <p className="eyebrow">YOUR DOCUMENTS, AT YOUR FINGERTIPS</p>
            <h2>What would you like to know?</h2>
            <p className="welcome-copy">
              Ask a question and I’ll find the answer in your knowledge base, with relevant sources.
            </p>
            <div className="suggestion-grid">
              {CHAT_SUGGESTIONS.map((suggestion) => (
                <button
                  className="suggestion-card"
                  key={suggestion.title}
                  type="button"
                  onClick={() => {
                    updateInput(suggestion.prompt);
                    inputRef.current?.focus();
                  }}
                >
                  <span>{suggestion.title}</span>
                  <span className="suggestion-arrow">↗</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="message-list">
            {messages.map((msg) => <MessageItem key={msg.id} message={msg} />)}
            <div ref={messagesEndRef} />
          </div>
        )}
        {loading && (
          <div className="thinking-indicator" aria-live="polite">
            <span className="assistant-avatar"><Sparkles size={15} /></span>
            <LoaderCircle size={15} className="spin" />
            <span>Searching your documents and writing an answer…</span>
          </div>
        )}
      </div>

      <div className="composer-wrap">
        <form onSubmit={handleSubmit} className="composer">
          <textarea
            ref={inputRef}
            className="composer-input"
            value={input}
            onChange={(event) => updateInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Message your knowledge base..."
            aria-label="Message your knowledge base"
            rows={1}
          />
          <button className="send-button" type="submit" disabled={loading || !input.trim()} aria-label="Send message">
            {loading ? <LoaderCircle size={17} className="spin" /> : <ArrowUp size={18} strokeWidth={2.5} />}
          </button>
        </form>
        <p className="composer-note">AI can make mistakes. Check important information against the source documents.</p>
      </div>
    </section>
  );
};