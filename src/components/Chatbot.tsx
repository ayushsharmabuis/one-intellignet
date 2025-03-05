
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  type: 'user' | 'bot';
  text: string;
  time: Date;
}

const Chatbot: React.FC = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      text: 'Hello! I\'m your One-Intelligent assistant. How can I help you today?',
      time: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      type: 'user',
      text: inputMessage,
      time: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses = [
        "I'm here to help with all your AI tool needs!",
        "One-Intelligent provides seamless access to multiple AI tools.",
        "You can explore various AI capabilities through our platform.",
        "Our dashboard lets you manage all your AI tools in one place.",
        "Would you like to know more about our pricing plans?",
        "Is there anything specific you'd like to know about our platform?"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        type: 'bot',
        text: randomResponse,
        time: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (showChatbot && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showChatbot]);

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button 
        className="fixed bottom-8 left-8 w-16 h-16 rounded-full bg-one-accent text-white flex items-center justify-center hover:bg-one-accent-hover transition-colors duration-300 shadow-glow-md z-50"
        onClick={toggleChatbot}
        aria-label="Toggle AI Assistant"
      >
        {showChatbot ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed bottom-28 left-8 w-96 h-[480px] bg-one-darker border border-one-border rounded-lg shadow-glow-md z-50 overflow-hidden animate-fade-in">
          <div className="flex justify-between items-center p-4 bg-one-dark border-b border-one-border">
            <h3 className="text-white font-semibold flex items-center">
              <MessageCircle size={18} className="mr-2 text-one-accent" />
              AI Assistant
            </h3>
            <button 
              onClick={toggleChatbot}
              className="text-one-text-muted hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <div 
            className="p-4 h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-one-border scrollbar-track-transparent"
            ref={messageContainerRef}
          >
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.type === 'user' 
                      ? 'bg-one-accent text-white rounded-br-none' 
                      : 'bg-one-card text-one-text rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block text-right">
                    {message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-one-border bg-one-dark">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="w-full bg-one-card border border-one-border rounded-full py-2 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-one-accent text-one-text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                ref={inputRef}
              />
              <button 
                className="absolute right-2 p-1 text-one-text-muted hover:text-one-accent transition-colors"
                onClick={handleSendMessage}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
