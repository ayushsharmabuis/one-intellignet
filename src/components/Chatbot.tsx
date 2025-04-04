import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, ChevronRight, MessageSquare, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface PredefinedQuestion {
  id: string;
  text: string;
  answer: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const questionsContainerRef = useRef<HTMLDivElement>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 4; // Show 4 questions per page

  // Predefined questions about One-Intelligent
  const predefinedQuestions: PredefinedQuestion[] = [
    {
      id: 'what-is',
      text: 'What is One-Intelligent?',
      answer: 'One-Intelligent is a revolutionary platform that brings together all your favorite AI tools into a single, unified interface. We\'ve created a seamless ecosystem where you can access, manage, and utilize a vast array of AI services without the hassle of juggling multiple subscriptions, logins, and interfaces.'
    },
    {
      id: 'how-many',
      text: 'How many AI tools are available?',
      answer: 'One-Intelligent provides access to over 1000+ AI tools across various categories including text generation, image creation, video editing, code development, audio processing, and productivity enhancement.'
    },
    {
      id: 'pricing',
      text: 'How much does it cost?',
      answer: 'One-Intelligent offers several pricing tiers to meet your needs. We have a free tier with limited access, and premium plans starting at $19/month that provide full access to our entire ecosystem of AI tools with unified billing.'
    },
    {
      id: 'benefits',
      text: 'What are the main benefits?',
      answer: 'The main benefits of One-Intelligent include: 1) No advertisements for a clean, distraction-free interface, 2) Direct tool access with seamless redirects, 3) Unified billing system for all AI tools, and 4) Personalized experience with recommendations based on your usage patterns.'
    },
    {
      id: 'get-started',
      text: 'How do I get started?',
      answer: 'Getting started with One-Intelligent is easy! Simply click the "Get Started" button on our homepage, create an account, and you\'ll immediately have access to our platform. You can then explore and start using any of the available AI tools right away.'
    },
    {
      id: 'compare',
      text: 'How does it compare to other platforms?',
      answer: 'Unlike other platforms that offer limited AI tools or require multiple subscriptions, One-Intelligent provides a comprehensive solution with all tools in one place. Our unified billing, seamless integration, and personalized recommendations make us the most user-friendly and cost-effective option on the market.'
    },
    {
      id: 'support',
      text: 'How do I get support?',
      answer: 'We offer 24/7 customer support through multiple channels. You can reach our support team via live chat directly from your dashboard, email us at support@one-intelligent.com, or schedule a one-on-one consultation with our AI specialists for more complex inquiries. Our comprehensive knowledge base also answers most common questions.'
    },
    {
      id: 'compatibility',
      text: 'What devices are supported?',
      answer: 'One-Intelligent is fully optimized for all devices and platforms. Our responsive web application works smoothly on desktop (Windows, macOS, Linux), mobile devices (iOS and Android), and tablets. We also offer native mobile apps for iOS and Android with additional offline capabilities and push notifications.'
    },
    {
      id: 'privacy',
      text: 'How is my data protected?',
      answer: 'Your privacy and data security are our top priorities. We employ enterprise-grade encryption (AES-256) for all data at rest and in transit. We\'re GDPR and CCPA compliant, with strict data access controls and regular security audits. Your data is never sold to third parties, and you can request full data deletion at any time.'
    },
    {
      id: 'integration',
      text: 'Can I integrate with my existing tools?',
      answer: 'Absolutely! One-Intelligent offers seamless integration with popular productivity tools and services. We provide API access and pre-built connectors for platforms like Google Workspace, Microsoft Office 365, Slack, Notion, Asana, Trello, and many more. Our developer SDK also allows for custom integrations with your proprietary systems.'
    },
    {
      id: 'ai-types',
      text: 'What types of AI tools are included?',
      answer: 'Our platform includes a comprehensive range of AI tools across these categories: Text Generation (ChatGPT, Claude, etc.), Image Creation (DALL-E, Midjourney, Stable Diffusion), Video Generation (Runway, HeyGen), Code Development (GitHub Copilot, CodeWhisperer), Audio Processing (ElevenLabs, Descript), Research & Data Analysis, Creative Design, Business Automation, and many more specialized categories.'
    },
    {
      id: 'updates',
      text: 'How often are new tools added?',
      answer: 'We continuously expand our AI tool ecosystem. On average, we add 15-20 new AI tools every month across various categories. Our dedicated AI research team evaluates and integrates the latest and most effective tools as soon as they become available. As a subscriber, you\'ll automatically get access to these new tools without any additional setup.'
    },
    {
      id: 'enterprise',
      text: 'Do you offer enterprise solutions?',
      answer: 'Yes, we provide comprehensive enterprise solutions with additional features like team management, advanced security controls, usage analytics, custom tool integration, dedicated account management, and volume pricing. Our enterprise tier includes SSO integration, role-based access control, and compliance reporting. Contact our sales team for a customized quote.'
    },
    {
      id: 'feedback',
      text: 'How can I request new features?',
      answer: 'We welcome user feedback and feature requests! You can submit suggestions directly through your dashboard using the "Feedback" button, participate in our monthly user feedback sessions, or join our community forum to discuss ideas with other users. Our product team regularly reviews all suggestions and incorporates them into our development roadmap.'
    }
  ];

  // Calculate total pages
  const totalPages = Math.ceil(predefinedQuestions.length / questionsPerPage);

  // Get current questions
  const getCurrentQuestions = () => {
    const startIndex = currentPage * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return predefinedQuestions.slice(startIndex, endIndex);
  };

  // Navigate to next page
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Navigate to previous page
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat is first opened
      const welcomeMessage: Message = {
        id: 'welcome',
        text: 'Hello! I\'m your One-Intelligent AI assistant. Please select a question from the list above to learn more about our platform.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    // Scroll to bottom of chat when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleQuestionClick = (question: PredefinedQuestion) => {
    setActiveQuestionId(question.id);
    
    // Add user question to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: question.text,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate typing delay for more natural feeling
    setTimeout(() => {
      // Add bot response
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: question.answer,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 mr-4 bg-one-dark border border-one-border rounded-lg shadow-lg max-w-[calc(100vw-32px)] sm:max-w-[400px] overflow-hidden transform transition-all duration-300 ease-in-out animate-slide-up">
          {/* Header */}
          <div className="bg-one-darker py-3 px-4 flex justify-between items-center border-b border-one-border">
            <div className="flex items-center">
              <Bot size={18} className="text-one-accent mr-2" />
              <h3 className="font-medium text-white text-base">AI Assistant</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="p-1.5 rounded-full hover:bg-one-light/10 text-gray-400 hover:text-white transition-colors"
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Questions Section */}
          <div className="bg-one-darker border-b border-one-border p-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs uppercase text-gray-300 font-semibold tracking-wide">Frequently Asked Questions</h4>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>Page {currentPage + 1}/{totalPages}</span>
              </div>
            </div>
            
            {/* Questions Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-2" ref={questionsContainerRef}>
                {getCurrentQuestions().map(question => (
                  <button
                    key={question.id}
                    onClick={() => handleQuestionClick(question)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-center hover:shadow-sm
                      ${activeQuestionId === question.id 
                        ? 'bg-one-accent text-white' 
                        : 'bg-one-light/20 text-gray-300 hover:bg-one-light/30'
                      }`}
                  >
                    {question.text}
                  </button>
                ))}
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-3">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`px-2 py-1 rounded text-xs ${
                    currentPage === 0 
                      ? 'text-gray-600 cursor-not-allowed' 
                      : 'text-one-accent hover:bg-one-accent/10'
                  }`}
                >
                  <div className="flex items-center">
                    <ArrowLeft size={14} className="mr-1" />
                    <span>Previous</span>
                  </div>
                </button>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPages - 1}
                  className={`px-2 py-1 rounded text-xs ${
                    currentPage >= totalPages - 1 
                      ? 'text-gray-600 cursor-not-allowed' 
                      : 'text-one-accent hover:bg-one-accent/10'
                  }`}
                >
                  <div className="flex items-center">
                    <span>Next</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          {/* Chat Messages Area */}
          <div 
            className="px-4 py-3 h-64 overflow-y-auto bg-one-dark" 
            ref={chatContainerRef}
          >
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`mb-3 ${message.isBot ? 'flex justify-start' : 'flex justify-end'} animate-fade-in`}
              >
                {message.isBot && (
                  <div className="w-6 h-6 rounded-full bg-one-accent/10 flex items-center justify-center mr-2 mt-1">
                    <Bot size={12} className="text-one-accent" />
                  </div>
                )}
                <div className="max-w-[80%]">
                  <div 
                    className={`p-3 rounded-xl ${
                      message.isBot 
                        ? 'bg-one-accent/10 border border-one-accent/20 text-white rounded-tl-none' 
                        : 'bg-one-accent text-white rounded-tr-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <div 
                    className={`text-xs text-gray-500 mt-1 ${
                      message.isBot ? 'text-left ml-1' : 'text-right mr-1'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {!message.isBot && (
                  <div className="w-6 h-6 rounded-full bg-one-accent flex items-center justify-center ml-2 mt-1">
                    <span className="text-white text-xs font-medium">You</span>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex mb-3 justify-start animate-fade-in">
                <div className="w-6 h-6 rounded-full bg-one-accent/10 flex items-center justify-center mr-2 mt-1">
                  <Bot size={12} className="text-one-accent" />
                </div>
                <div className="bg-one-accent/10 border border-one-accent/20 p-3 rounded-xl rounded-tl-none">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {messages.length === 0 && !isTyping && (
              <div className="flex justify-center items-center h-full text-gray-500">
                <p className="text-sm">Start by selecting a question above</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="bg-one-darker p-3 border-t border-one-border">
            <div className="text-center text-xs text-gray-400">
              Select a question above to learn more about One-Intelligent
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Toggle Button */}
      <button 
        onClick={toggleChat}
        className="m-4 w-12 h-12 rounded-full bg-one-accent hover:bg-one-accent/90 text-white flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </button>
    </div>
  );
};

export default Chatbot; 