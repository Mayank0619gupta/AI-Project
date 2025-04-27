
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';
import { ChatContextType } from '@/types/chat';
import { useChatState } from '@/hooks/useChatState';
import { useMessageHandling } from '@/hooks/useMessageHandling';

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

  const {
    createNewSession,
    loadSession,
    sendMessage,
    deleteSession
  } = useMessageHandling({
    user,
    sessions,
    setSessions,
    currentSession,
    setCurrentSession,
    setLoading,
    setError,
    apiKeyConfigured
  });

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
