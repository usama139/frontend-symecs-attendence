import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const RAGFLOW_API_KEY = 'rag_sk_57dc3f606e0b2df89366bf43f770afd9';
// RAGFlow server URL - set VITE_RAGFLOW_URL in .env or it defaults to localhost
const RAGFLOW_BASE_URL = import.meta.env.VITE_RAGFLOW_URL || 'http://localhost:9380';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Assalam o Alaikum! 👋 Main Symecs Institute ka AI Assistant hun. Koi bhi sawal poochein!',
      time: new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new message appears
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Initialize: get list of chats and pick the first one
  const initializeChat = async () => {
    try {
      const res = await fetch(`${RAGFLOW_BASE_URL}/api/v1/chats?page=1&page_size=1`, {
        headers: {
          Authorization: `Bearer ${RAGFLOW_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.code === 0 && data.data?.length > 0) {
        const id = data.data[0].id;
        setChatId(id);
        return id;
      } else {
        setError('Chat assistant not found. Please set up RAGFlow first.');
        return null;
      }
    } catch (err) {
      console.error('Failed to fetch chats:', err);
      setError('Cannot connect to AI server. Please try again later.');
      return null;
    }
  };

  // Create a new session
  const createSession = async (cId) => {
    try {
      const res = await fetch(`${RAGFLOW_BASE_URL}/api/v1/chats/${cId}/sessions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RAGFLOW_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Symecs Chat Session' }),
      });
      const data = await res.json();
      if (data.code === 0) {
        setSessionId(data.data.id);
        return data.data.id;
      }
      return null;
    } catch (err) {
      console.error('Failed to create session:', err);
      return null;
    }
  };

  // Send message to RAGFlow
  const sendMessage = async (question, cId, sId) => {
    const res = await fetch(`${RAGFLOW_BASE_URL}/api/v1/chats/${cId}/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RAGFLOW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        session_id: sId,
        stream: false,
      }),
    });
    const data = await res.json();
    if (data.code === 0) {
      return data.data?.answer || 'Maafi chahta hun, jawab nahi de saka.';
    }
    throw new Error(data.message || 'API Error');
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const text = inputText.trim();
    if (!text || isLoading) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      let cId = chatId;
      let sId = sessionId;

      // Initialize chat and session if not done
      if (!cId) {
        cId = await initializeChat();
        if (!cId) {
          setIsLoading(false);
          return;
        }
      }
      if (!sId) {
        sId = await createSession(cId);
        if (!sId) {
          setIsLoading(false);
          setError('Session create nahi ho saki.');
          return;
        }
      }

      const answer = await sendMessage(text, cId, sId);

      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: answer,
        time: new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Maafi chahta hun, abhi kuch masla aa gaya. Thodi der baad dobara try karein.',
          time: new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z"/>
              </svg>
            </div>
            <div>
              <h4>Symecs AI Assistant</h4>
              <span className="chatbot-status">
                <span className="status-dot"></span> Online
              </span>
            </div>
          </div>
          <button className="chatbot-close-btn" onClick={handleToggle} title="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chatbot-msg ${msg.role === 'user' ? 'user' : 'bot'} ${msg.isError ? 'error' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="bot-avatar-small">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z"/>
                  </svg>
                </div>
              )}
              <div className="msg-bubble">
                <p>{msg.content}</p>
                <span className="msg-time">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="chatbot-msg bot">
              <div className="bot-avatar-small">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z"/>
                </svg>
              </div>
              <div className="msg-bubble typing-bubble">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

          {error && (
            <div className="chatbot-error-banner">
              ⚠️ {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className="chatbot-input-area" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder="Sawal poochein..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            maxLength={500}
          />
          <button
            type="submit"
            className="chatbot-send-btn"
            disabled={isLoading || !inputText.trim()}
            title="Send"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
      </div>

      {/* Floating Chat Button */}
      <button
        className={`chatbot-float-btn ${isOpen ? 'active' : ''}`}
        onClick={handleToggle}
        title="AI Assistant se baat karein"
        aria-label="Open AI Chatbot"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
        )}
        {!isOpen && <span className="chatbot-float-badge">AI</span>}
      </button>
    </>
  );
};

export default Chatbot;
