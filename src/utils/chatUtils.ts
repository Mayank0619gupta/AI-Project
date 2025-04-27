
import { ChatSession, Message } from '@/types/chat';

export const SESSIONS_STORAGE_KEY = 'startup_vision_chat_sessions';
export const CURRENT_SESSION_KEY = 'startup_vision_current_session';

export const getFallbackResponse = async (message: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (message.toLowerCase().includes('idea') || message.toLowerCase().includes('startup') || message.toLowerCase().includes('business')) {
    return `Thank you for sharing your business idea. As your AI business analyst, here's my assessment:

1. Market Potential: Your idea has potential in the current market landscape.
2. Unique Value Proposition: Consider refining what makes your solution truly unique.
3. Target Audience: Be more specific about which student demographics you're serving.
4. Revenue Model: Explore multiple revenue streams to ensure sustainability.
5. Next Steps: I recommend conducting a small-scale pilot with your fellow students.

Would you like me to elaborate on any of these points or discuss specific aspects of your business model?

Note: This is a fallback response. To get real-time AI analysis, please configure your API key in settings.`;
  }
  
  return "I'm your business idea assessment assistant for students. I can help analyze your startup concept, suggest improvements, or discuss market strategies. Please share your business idea or ask a specific question about entrepreneurship.\n\nNote: This is a fallback response. To get real-time AI analysis, please configure your API key in settings.";
};

export const loadStoredSessions = (userRegNumber: string): ChatSession[] => {
  const storedSessions = localStorage.getItem(`${SESSIONS_STORAGE_KEY}_${userRegNumber}`);
  return storedSessions ? JSON.parse(storedSessions) : [];
};

export const saveSessionsToStorage = (sessions: ChatSession[], userRegNumber: string): void => {
  localStorage.setItem(`${SESSIONS_STORAGE_KEY}_${userRegNumber}`, JSON.stringify(sessions));
};

export const createNewChatSession = (sessionsCount: number): ChatSession => {
  return {
    id: Date.now().toString(),
    title: `New Chat ${sessionsCount + 1}`,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

export const updateSessionTitle = (
  sessions: ChatSession[],
  sessionId: string,
  firstMessage: string
): ChatSession[] => {
  const title = firstMessage.length > 30 
    ? `${firstMessage.substring(0, 30)}...` 
    : firstMessage;
  
  return sessions.map(session => 
    session.id === sessionId 
      ? { ...session, title } 
      : session
  );
};
