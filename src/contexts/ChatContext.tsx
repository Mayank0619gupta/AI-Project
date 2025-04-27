
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';
import aiService from '@/services/aiService';
import { ChatContextType, Message, ChatSession } from '@/types/chat';
import { useChatState } from '@/hooks/useChatState';
import {
  createNewChatSession,
  saveSessionsToStorage,
  updateSessionTitle,
  getFallbackResponse,
  CURRENT_SESSION_KEY
} from '@/utils/chatUtils';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const {
    sessions,
    setSessions,
    currentSession,
    setCurrentSession,
    loading,
    setLoading,
    error,
    setError,
    apiKeyConfigured
  } = useChatState(user?.regNumber);

  const createNewSession = () => {
    if (!user) return;
    
    const newSession = createNewChatSession(sessions.length);
    const updatedSessions = [newSession, ...sessions];
    
    saveSessionsToStorage(updatedSessions, user.regNumber);
    setSessions(updatedSessions);
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

      let updatedSessions = sessions.map(session => 
        session.id === currentSession.id ? updatedSession : session
      );
      
      saveSessionsToStorage(updatedSessions, user.regNumber);
      setSessions(updatedSessions);
      setCurrentSession(updatedSession);

      if (currentSession.messages.length === 0) {
        updatedSessions = updateSessionTitle(updatedSessions, currentSession.id, content);
        saveSessionsToStorage(updatedSessions, user.regNumber);
        setSessions(updatedSessions);
      }

      let responseText: string;
      try {
        if (apiKeyConfigured) {
          responseText = await aiService.generateResponse([
            ...updatedSession.messages.filter(m => m.role !== 'system'),
            userMessage
          ]);
        } else {
          responseText = await getFallbackResponse(content);
        }
      } catch (error) {
        console.error("Error getting AI response:", error);
        responseText = "I'm sorry, I encountered an error while processing your request. " + 
          (error instanceof Error ? error.message : "Please try again later.");
      }

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

      updatedSessions = updatedSessions.map(session => 
        session.id === currentSession.id ? updatedSession : session
      );
      
      saveSessionsToStorage(updatedSessions, user.regNumber);
      setSessions(updatedSessions);
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
    if (user) {
      saveSessionsToStorage(updatedSessions, user.regNumber);
    }
    setSessions(updatedSessions);
    
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
    apiKeyConfigured,
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
