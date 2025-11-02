import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Welcome to Hotelogix! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const checkConnection = async () => {
    try {
      const response = await fetch('http://localhost:5001/health');
      if (response.ok) {
        setIsConnected(true);
      }
    } catch (error) {
      console.log('Chatbot API not available:', error);
      setIsConnected(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      if (!isConnected) {
        setTimeout(() => {
          const fallbackResponse = {
            id: Date.now() + 1,
            text: "I'm sorry, I'm currently offline. Please contact our support team at +92 310 4594964 or email shehroozking3@gmail.com for assistance.",
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, fallbackResponse]);
          setIsTyping(false);
        }, 1000);
        return;
      }

      const response = await fetch('http://localhost:5001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage })
      });

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.response || "I'm sorry, I couldn't process your request.",
        sender: 'bot',
        timestamp: new Date(),
        confidence: data.confidence
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm experiencing some technical difficulties. Please try again or contact our support team.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    "I want to book a room",
    "What rooms do you have?",
    "Do you have any deals?",
    "What are your amenities?",
    "How can I contact you?"
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <div className={`chatbot-toggle ${isOpen ? 'open' : ''}`} onClick={toggleChatbot}>
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <>
            <i className="fas fa-robot"></i>
            <div className="chat-notification">
              <i className="fas fa-sparkles"></i>
            </div>
          </>
        )}
      </div>

      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-avatar">
            <i className="fas fa-robot"></i>
          </div>
          <div className="chatbot-info">
            <h4>Hotelogix AI Assistant</h4>
            <span className={`status ${isConnected ? 'online' : 'offline'}`}>
              {isConnected ? '🟢 Online' : '🔴 Offline'}
            </span>
          </div>
          <button className="close-btn" onClick={toggleChatbot}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">{formatTime(message.timestamp)}</span>
                {message.confidence && (
                  <span className="confidence">Confidence: {(message.confidence * 100).toFixed(0)}%</span>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot typing">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="quick-actions">
            <p>Quick questions:</p>
            <div className="quick-buttons">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-btn"
                  onClick={() => handleQuickAction(action)}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="chatbot-input">
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isTyping}
            />
            <button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || isTyping}
              className="send-btn"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
