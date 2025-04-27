
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

type ChatContextType = {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  loading: boolean;
  error: string | null;
  createNewSession: () => void;
  loadSession: (sessionId: string) => void;
  sendMessage: (message: string) => Promise<void>;
  deleteSession: (sessionId: string) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const SESSIONS_STORAGE_KEY = 'startup_vision_chat_sessions';
const CURRENT_SESSION_KEY = 'startup_vision_current_session';

// Mock Gemini API response function - in a real app, this would call the actual API
const mockGeminiResponse = async (message: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response logic for business idea assessment
  if (message.toLowerCase().includes('idea') || message.toLowerCase().includes('startup') || message.toLowerCase().includes('business')) {
    return `Thank you for sharing your business idea. As your AI business analyst, here's my assessment:

1. Market Potential: Your idea has potential in the current market landscape.
2. Unique Value Proposition: Consider refining what makes your solution truly unique.
3. Target Audience: Be more specific about which student demographics you're serving.
4. Revenue Model: Explore multiple revenue streams to ensure sustainability.
5. Next Steps: I recommend conducting a small-scale pilot with your fellow students.

Would you like me to elaborate on any of these points or discuss specific aspects of your business model?`;
  } else {
    return "I'm your business idea assessment assistant for students. I can help analyze your startup concept, suggest improvements, or discuss market strategies. Please share your business idea or ask a specific question about entrepreneurship.";
  }
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load sessions from localStorage when user changes
  useEffect(() => {
    if (user) {
      loadSessions();
      const currentSessionId = localStorage.getItem(CURRENT_SESSION_KEY);
      if (currentSessionId) {
        const session = sessions.find(s => s.id === currentSessionId);
        if (session) {
          setCurrentSession(session);
        } else if (sessions.length > 0) {
          setCurrentSession(sessions[0]);
          localStorage.setItem(CURRENT_SESSION_KEY, sessions[0].id);
        }
      } else if (sessions.length > 0) {
        setCurrentSession(sessions[0]);
        localStorage.setItem(CURRENT_SESSION_KEY, sessions[0].id);
      }
    } else {
      setSessions([]);
      setCurrentSession(null);
      localStorage.removeItem(CURRENT_SESSION_KEY);
    }
  }, [user]);

  const loadSessions = () => {
    if (!user) return;
    
    const storedSessions = localStorage.getItem(`${SESSIONS_STORAGE_KEY}_${user.regNumber}`);
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
  };

  const saveSessions = (updatedSessions: ChatSession[]) => {
    if (!user) return;
    
    setSessions(updatedSessions);
    localStorage.setItem(`${SESSIONS_STORAGE_KEY}_${user.regNumber}`, JSON.stringify(updatedSessions));
  };

  const createNewSession = () => {
    if (!user) return;
    
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `New Chat ${sessions.length + 1}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const updatedSessions = [newSession, ...sessions];
    saveSessions(updatedSessions);
    setCurrentSession(newSession);
    localStorage.setItem(CURRENT_SESSION_KEY, newSession.id);
  };

  const loadSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
    }
  };

  const updateSessionTitle = (sessionId: string, firstMessage: string) => {
    // Generate a title based on the first message
    const title = firstMessage.length > 30 
      ? `${firstMessage.substring(0, 30)}...` 
      : firstMessage;
    
    const updatedSessions = sessions.map(session => 
      session.id === sessionId 
        ? { ...session, title } 
        : session
    );
    
    saveSessions(updatedSessions);
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!user || !currentSession) {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to send messages",
          variant: "destructive",
        });
      } else {
        createNewSession();
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Add user message
      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        content,
        role: 'user',
        timestamp: Date.now(),
      };

      let updatedSession: ChatSession = {
        ...currentSession,
        messages: [...currentSession.messages, userMessage],
        updatedAt: Date.now(),
      };

      // Update the session immediately with user message
      const updatedSessions = sessions.map(session => 
        session.id === currentSession.id ? updatedSession : session
      );
      saveSessions(updatedSessions);
      setCurrentSession(updatedSession);

      // If this is the first message, update the title
      if (currentSession.messages.length === 0) {
        updateSessionTitle(currentSession.id, content);
      }

      // Get AI response
      const responseText = await mockGeminiResponse(content);

      // Add AI message
      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        content: responseText,
        role: 'assistant',
        timestamp: Date.now(),
      };

      updatedSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiMessage],
        updatedAt: Date.now(),
      };

      // Update the session with AI response
      const finalSessions = updatedSessions.map(session => 
        session.id === currentSession.id ? updatedSession : session
      );
      saveSessions(finalSessions);
      setCurrentSession(updatedSession);
    } catch (err) {
      setError("Failed to send message. Please try again.");
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    saveSessions(updatedSessions);
    
    if (currentSession?.id === sessionId) {
      if (updatedSessions.length > 0) {
        setCurrentSession(updatedSessions[0]);
        localStorage.setItem(CURRENT_SESSION_KEY, updatedSessions[0].id);
      } else {
        setCurrentSession(null);
        localStorage.removeItem(CURRENT_SESSION_KEY);
      }
    }
  };

  const contextValue: ChatContextType = {
    currentSession,
    sessions,
    loading,
    error,
    createNewSession,
    loadSession,
    sendMessage,
    deleteSession,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
