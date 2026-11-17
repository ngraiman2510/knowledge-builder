import { useState } from 'react';
import { FileUploads } from '../components/uploads/FileUploads';
import { ChatBot } from '../components/chat/ChatBot';
import { BrainCircuit, MessageSquarePlus } from 'lucide-react';

export const KnowledgeBuilder = () => {
  const [chatKey, setChatKey] = useState(0);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark"><BrainCircuit size={19} strokeWidth={2.2} /></div>
          <span>Knowledge<span className="brand-light">AI</span></span>
        </div>

        <button className="new-chat-button" type="button" onClick={() => setChatKey((key) => key + 1)}>
          <MessageSquarePlus size={17} />
          <span>New chat</span>
        </button>

        <div className="sidebar-section-heading">
          <span>KNOWLEDGE BASE</span>
        </div>
        <FileUploads />

        <div className="sidebar-footer">
          <div className="connection-dot" />
          <span>Workspace ready</span>
        </div>
      </aside>

      <main className="chat-workspace">
        <header className="workspace-header">
          <div className="workspace-title">
            <span className="mobile-brand-mark"><BrainCircuit size={18} /></span>
            <div>
              <h1>Knowledge assistant</h1>
              <p>Ask anything about your documents</p>
            </div>
          </div>
          <div className="model-badge"><span /> RAG assistant</div>
        </header>
        <ChatBot key={chatKey} />
      </main>
    </div>
  );
};
