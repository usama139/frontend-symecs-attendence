import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Phone, GraduationCap, MapPin } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Assalam-o-Alaikum! Welcome to SYMECS Institute Mirpurkhas. How can I assist you today with our courses or admissions?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const quickQuestions = [
    '🎓 DIT 1-Year Diploma details?',
    '🤖 AI 3-Month Course info?',
    '📜 Sindh Board certification?',
    '📍 Institute location & contact?'
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const generateBotResponse = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes('dit') || text.includes('diploma') || text.includes('1 year')) {
      return '🎓 **Diploma in Information Technology (DIT)** is a 1-Year (2 Semesters) program certified by the **Sindh Board of Technical Education (SBTE)**. It covers Office Automation, Programming (C++), Web Design (HTML/CSS), Databases (MySQL), and Networking.';
    }
    if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('3 month')) {
      return '🤖 Our **AI (Artificial Intelligence) Course** is a 3-month practical program covering ChatGPT Prompt Engineering, Python for AI, Machine Learning fundamentals, and AI Workflow Automation.';
    }
    if (text.includes('cit') || text.includes('basic') || text.includes('advance')) {
      return '💻 We offer both **CIT Basic (6 Months)** covering Windows, MS Office, and InPage Urdu, and **CIT Advance (6 Months)** covering Photoshop graphics, financial Excel, and web development.';
    }
    if (text.includes('english') || text.includes('language') || text.includes('spoken')) {
      return '🗣️ Our **English Language Course** is a 6-month intensive program focusing on Spoken English fluency, Grammar mastery, Public Speaking, and Job Interview Preparation.';
    }
    if (text.includes('location') || text.includes('address') || text.includes('where')) {
      return '📍 **Campus Address**: Malik Jamat Khana 2nd floor, dholnabad Mirpurkhas, Sindh.\n📞 **Helpline**: 03123795549';
    }
    if (text.includes('fee') || text.includes('admission') || text.includes('apply')) {
      return '📝 Admissions for Session 2026 are currently OPEN! You can fill the Online Admission Form on our website or visit our campus. Call us at 03123795549 for fee structure details.';
    }
    if (text.includes('contact') || text.includes('phone') || text.includes('number') || text.includes('whatsapp')) {
      return '📞 You can call or WhatsApp our admissions desk directly at **03123795549** or email us at **symecsmalik@gmail.com**.';
    }

    return 'Thank you for reaching out! SYMECS Institute offers DIT (1 Year), AI (3 Months), CIT Advance & Basic (6 Months), and English Language (6 Months). Would you like help filling out the admission form or speaking to an advisor at 03123795549?';
  };

  const handleSend = (textToSend = inputValue) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateBotResponse(trimmed);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="symecs-chatbot-container">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="symecs-chat-window animate-modal">
          
          {/* Header */}
          <div className="symecs-chat-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <Bot size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">SYMECS AI Assistant</h4>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online • Institute Support
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="symecs-chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  msg.sender === 'user' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-cyan-400 border border-slate-700'
                }`}>
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="text-[9px] opacity-60 block text-right mt-1 font-mono">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <Bot size={16} className="text-cyan-400 animate-spin" />
                <span>SYMECS Assistant is typing...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick FAQ Chips */}
          <div className="p-2.5 bg-slate-950/80 border-t border-slate-800/80 flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about courses, admissions, fees..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white disabled:opacity-40 hover:opacity-95 transition"
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="symecs-chat-toggle-btn"
        title="Chat with SYMECS AI Assistant"
        aria-label="Toggle SYMECS AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        <span className="symecs-badge">AI</span>
      </button>

    </div>
  );
};

export default Chatbot;
