
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Background3D } from '@/components/Background3D';
import { ApiKeySettings } from '@/components/ApiKeySettings';
import { SendHorizonal, Plus, Settings } from 'lucide-react';

const ChatPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { currentSession, createNewSession, sendMessage, loading, apiKeyConfigured } = useChat();
  const [message, setMessage] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!currentSession) {
      createNewSession();
    }
  }, [isAuthenticated, currentSession, navigate, createNewSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    
    await sendMessage(message);
    setMessage('');
  };

  if (!isAuthenticated || !currentSession) {
    return null;
  }

  return (
    <>
      <Background3D />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 container mx-auto px-4 py-4 md:py-8 flex flex-col">
          <div className="flex-1 flex flex-col h-[calc(100vh-15rem)]">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gradient">
                {currentSession.title}
              </h1>
              
              <div className="flex items-center space-x-2">
                {!apiKeyConfigured && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center gap-1 bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 hover:text-yellow-200"
                  >
                    <Settings className="h-4 w-4" />
                    Set API Key
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsSettingsOpen(true)}
                  className={apiKeyConfigured ? "flex items-center gap-1" : "hidden md:flex items-center gap-1"}
                >
                  <Settings className="h-4 w-4" />
                  {apiKeyConfigured ? "API Settings" : "Settings"}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={createNewSession}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto glass-morphism rounded-lg p-4 mb-4">
              {currentSession.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <svg className="w-12 h-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-gradient">Welcome to StartupVision AI</h3>
                  <p className="text-muted-foreground max-w-sm">
                    I'm your business analysis assistant. Share your startup idea and I'll provide feedback, suggestions, and help improve your concept.
                  </p>
                  
                  {!apiKeyConfigured && (
                    <div className="mt-4 p-3 rounded-lg bg-yellow-900/20 border border-yellow-700/50 max-w-sm">
                      <p className="text-sm text-yellow-300 mb-2">
                        <strong>Using Demo Mode:</strong> For more accurate responses, configure your OpenAI API key.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsSettingsOpen(true)}
                        className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 hover:text-yellow-200 text-xs"
                      >
                        Configure API Key
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {currentSession.messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'neo-blur'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        <div 
                          className={`text-xs mt-1 ${
                            msg.role === 'user' 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="flex flex-col md:flex-row items-end gap-2">
              <div className="flex-1">
                <Textarea
                  placeholder="Ask about your business idea or startup concept..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="glass-morphism min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
              </div>
              
              <Button type="submit" disabled={loading || !message.trim()}>
                {loading ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <SendHorizonal className="h-5 w-5" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      <ApiKeySettings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
};

export default ChatPage;
