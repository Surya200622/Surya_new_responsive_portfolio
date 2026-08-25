'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Trash2 } from 'lucide-react';
import './ChatbotWidget.css';

const INITIAL_MESSAGE = { role: 'assistant', content: 'Hi! I am Surya\'s AI assistant. Ask me anything about his full-stack web development services, experience, or request a quote!' };
const QUICK_REPLIES = [
  "What services do you offer?",
  "How much for a custom website?",
  "Tell me about your tech stack"
];

const renderMessage = (content) => {
  if (!content) return null;
  // Strip horizontal rules or equal signs used for dividers
  let cleanContent = content.replace(/={3,}/g, '').replace(/-{4,}/g, '');
  
  const lines = cleanContent.split('\n');
  return lines.map((line, i) => {
    // Convert headings to bold
    let processedLine = line.trim();
    if (processedLine.startsWith('###')) {
      processedLine = `**${processedLine.replace(/^###\s*/, '')}**`;
    } else if (processedLine.startsWith('##')) {
      processedLine = `**${processedLine.replace(/^##\s*/, '')}**`;
    } else if (processedLine.startsWith('#')) {
      processedLine = `**${processedLine.replace(/^#\s*/, '')}**`;
    }

    const parts = processedLine.split(/(\*\*.*?\*\*)/g);
    return (
      <div key={i} style={{ minHeight: processedLine === '' ? '12px' : 'auto', marginBottom: '4px' }}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        })}
      </div>
    );
  });
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('surya-chatbot-history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages([INITIAL_MESSAGE]);
      }
    }
  }, []);

  // Save history to local storage whenever messages change
  useEffect(() => {
    localStorage.setItem('surya-chatbot-history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages, isLoading]);

  const clearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
    localStorage.removeItem('surya-chatbot-history');
  };

  const sendToBot = async (userMsg) => {
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          currentPath: window.location.pathname,
          currentUrl: window.location.href
        }),
      });

      if (!res.ok) {
        let errorMsg = 'Glitch occurred. Please try again.';
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } catch(e) {}
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMsg}` }]);
        setIsLoading(false);
        return;
      }

      // Remove typing indicator when streaming starts
      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessage += decoder.decode(value, { stream: true });
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantMessage;
          return newMessages;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Connection error: ${error.message}` }]);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    await sendToBot(userMsg);
  };

  const handleQuickReply = (text) => {
    if (isLoading) return;
    sendToBot(text);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        className="chatbot-toggle"
        aria-label="Toggle Chatbot"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="chatbot-header">
              <div className="chatbot-title">
                <Bot size={20} className="text-accent" />
                <span>Surya's AI Assistant</span>
              </div>
              <div className="chatbot-actions">
                <button className="chatbot-icon-btn" onClick={clearHistory} title="Clear Chat">
                  <Trash2 size={16} />
                </button>
                <button className="chatbot-icon-btn" onClick={() => setIsOpen(false)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="chatbot-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble-wrapper ${msg.role === 'user' ? 'chat-right' : 'chat-left'}`}>
                  <div className="chat-avatar">
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`chat-bubble ${msg.role === 'user' ? 'bubble-user' : 'bubble-assistant'}`}>
                    {renderMessage(msg.content)}
                  </div>
                </div>
              ))}
              
              {messages.length === 1 && (
                <div className="chat-quick-replies">
                  {QUICK_REPLIES.map((reply, idx) => (
                    <button 
                      key={idx} 
                      className="chat-quick-reply-btn" 
                      onClick={() => handleQuickReply(reply)}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="chat-bubble-wrapper chat-left">
                  <div className="chat-avatar"><Bot size={14} /></div>
                  <div className="chat-bubble bubble-assistant typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chatbot-input-area">
              <input
                type="text"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button type="submit" disabled={!input.trim() || isLoading}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
