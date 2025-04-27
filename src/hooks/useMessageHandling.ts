
import { toast } from '@/components/ui/use-toast';
import { ChatSession, Message } from '@/types/chat';
import aiService from '@/services/aiService';
import { 
  createNewChatSession,
  saveSessionsToStorage,
  updateSessionTitle,
  getFallbackResponse,
  CURRENT_SESSION_KEY 
} from '@/utils/chatUtils';

type UseMessageHandlingProps = {
  user: any;
  sessions: ChatSession[];
  setSessions: (sessions: ChatSession[]) => void;
  currentSession: ChatSession | null;
  setCurrentSession: (session: ChatSession | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  apiKeyConfigured: boolean;
};

export const useMessageHandling = ({
  user,
  sessions,
  setSessions,
  currentSession,
  setCurrentSession,
  setLoading,
  setError,
  apiKeyConfigured
}: UseMessageHandlingProps) => {
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

  return {
    createNewSession,
    loadSession,
    sendMessage,
    deleteSession
  };
};
