
export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

export type ChatContextType = {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  loading: boolean;
  error: string | null;
  createNewSession: () => void;
  loadSession: (sessionId: string) => void;
  sendMessage: (message: string) => Promise<void>;
  deleteSession: (sessionId: string) => void;
  apiKeyConfigured: boolean;
};
