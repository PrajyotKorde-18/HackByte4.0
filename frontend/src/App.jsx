import React, { useState, useEffect, useRef } from 'react'
import './index.css'

function App() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am PromptBridge. I connect user intent with optimized LLM performance. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [trace, setTrace] = useState([]);
  const [optimizedPrompt, setOptimizedPrompt] = useState(null);
  const [understanding, setUnderstanding] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setLoading(true);
    setInput('');
    setTrace([]);
    setOptimizedPrompt(null);
    setUnderstanding(null);

    try {
      const history = currentMessages.map(m => ({ role: m.role, text: m.text }));

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          history: history, 
          optimization: isOptimizing 
        }),
      });
      const data = await response.json();
      
      setTrace(data.trace);
      setOptimizedPrompt(data.optimized_prompt);
      setUnderstanding(data.structured_understanding);
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Backend is offline. Please start the PromptBridge server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="glass-bg"></div>
      
      <div className="container">
        <header>
          <div className="logo">
            Prompt<span>Bridge</span> <span style={{ fontSize: '0.8rem', marginLeft: '1rem', opacity: 0.4 }}>Intelligence v4</span>
          </div>
          <div className="nav-links">
            <button className="btn-primary" onClick={() => setIsOptimizing(!isOptimizing)}>
              {isOptimizing ? '⚡ Optimizer ON' : 'Optimize Current Prompt'}
            </button>
          </div>
        </header>

        <section className="hero">
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h1 className="animate-float" style={{ fontSize: '2.5rem' }}>The Intelligent Bridge to LLM Performance.</h1>
            <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.0rem' }}>
              PromptBridge decodes your intent and evolves your prompts for maximum clarity and speed. 
              No more generic fallbacks—just precision orchestration.
            </p>
          </div>
        </section>

        {understanding && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <div className="glass-card" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', border: '1px solid #8b5cf6', color: '#8b5cf6' }}>
              Topic: <strong>{understanding.topic}</strong>
            </div>
            <div className="glass-card" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', border: '1px solid #06b6d4', color: '#06b6d4' }}>
              Level: <strong>{understanding.level}</strong>
            </div>
            <div className="glass-card" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', border: '1px solid #f43f5e', color: '#f43f5e' }}>
              Domain: <strong>{understanding.domain}</strong>
            </div>
          </div>
        )}

        <div className="chat-container">
          <section className="glass-card chat-box">
            <h3 style={{ marginBottom: '1rem', color: '#8b5cf6', fontSize: '0.9rem' }}>Bridge Playground</h3>
            <div className="messages">
              {messages.map((m, i) => (
                <div key={i} className={`message ${m.role}`}>
                  {m.text}
                </div>
              ))}
              {loading && <div className="message bot" style={{ fontStyle: 'italic', opacity: 0.6 }}>Bridging & Optimizing...</div>}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Ask PromptBridge anything..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="btn-primary" onClick={handleSend} disabled={loading}>
                Send
              </button>
            </div>
          </section>

          <aside className="glass-card trace-pane">
            <h3 style={{ marginBottom: '1rem', color: '#06b6d4', fontSize: '0.9rem' }}>PromptBridge Intelligence Trace</h3>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {trace.length === 0 ? (
                <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>Bridge logs will pop up here...</p>
              ) : (
                trace.map((t, i) => (
                  <div key={i} className={`trace-step ${t.status === 'running' ? 'running' : ''}`}>
                    <div style={{ fontWeight: 600, fontSize: '0.7rem', color: t.status === 'done' ? '#10b981' : '#f43f5e' }}>
                      {t.step} {t.status === 'done' ? '✓' : '...'}
                    </div>
                    <div style={{ opacity: 0.8, marginTop: '0.2rem', fontSize: '0.65rem', wordBreak: 'break-word' }}>{t.content}</div>
                  </div>
                ))
              )}
            </div>

            {optimizedPrompt && (
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                <h4 style={{ color: '#f43f5e', marginBottom: '0.5rem', fontSize: '0.75rem' }}>PromptBridge Evolved Output</h4>
                <div style={{ fontSize: '0.6rem', opacity: 0.6, color: '#f8fafc', fontStyle: 'italic', wordBreak: 'break-word' }}>
                  {optimizedPrompt}
                </div>
              </div>
            )}
          </aside>
        </div>

        <section className="features">
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: '#8b5cf6', fontSize: '1rem', marginBottom: '0.5rem' }}>Intent Bridging</h4>
            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>We bridge the gap between simple user requests and complex LLM instructions.</p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: '#06b6d4', fontSize: '1rem', marginBottom: '0.5rem' }}>Domain Mapping</h4>
            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Automatically maps requests to specific technical domains for better clarity.</p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: '#f43f5e', fontSize: '1rem', marginBottom: '0.5rem' }}>Live Optimization</h4>
            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>The internal engine evolves the prompt in real-time based on learner level constraints.</p>
          </div>
        </section>

        <footer style={{ marginTop: '4rem', padding: '3rem 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p>© 2026 PromptBridge Intelligence v4 - Precision Orchestration</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
