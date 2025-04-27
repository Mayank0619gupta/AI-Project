
import { useState, useEffect } from 'react';
import { ChatSession } from '@/types/chat';
import aiService from '@/services/aiService';
import { 
  loadStoredSessions, 
  saveSessionsToStorage,
  CURRENT_SESSION_KEY 
} from '@/utils/chatUtils';

export const useChatState = (userRegNumber: string | undefined) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean>(false);

  useEffect(() => {
    const checkApiKey = () => {
      const hasKey = aiService.hasApiKey();
      setApiKeyConfigured(hasKey);
    };

    checkApiKey();
    window.addEventListener('storage', checkApiKey);
    return () => {
      window.removeEventListener('storage', checkApiKey);
    };
  }, []);

  useEffect(() => {
    if (userRegNumber) {
      const storedSessions = loadStoredSessions(userRegNumber);
      setSessions(storedSessions);

      const currentSessionId = localStorage.getItem(CURRENT_SESSION_KEY);
      if (currentSessionId) {
        const session = storedSessions.find(s => s.id === currentSessionId);
        if (session) {
          setCurrentSession(session);
        } else if (storedSessions.length > 0) {
          setCurrentSession(storedSessions[0]);
          localStorage.setItem(CURRENT_SESSION_KEY, storedSessions[0].id);
        }
      } else if (storedSessions.length > 0) {
        setCurrentSession(storedSessions[0]);
        localStorage.setItem(CURRENT_SESSION_KEY, storedSessions[0].id);
      }
    } else {
      setSessions([]);
      setCurrentSession(null);
      localStorage.removeItem(CURRENT_SESSION_KEY);
    }
  }, [userRegNumber]);

  return {
    sessions,
    setSessions,
    currentSession,
    setCurrentSession,
    loading,
    setLoading,
    error,
    setError,
    apiKeyConfigured
  };
};
