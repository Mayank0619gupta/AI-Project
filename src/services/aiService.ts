import { Message } from '@/types/chat';

// API configuration
const API_URL = "https://api.openai.com/v1/chat/completions";

// Interface for API request
interface ChatCompletionRequest {
  model: string;
  messages: {
    role: string;
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
}

// Interface for API response
interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class AIService {
  private apiKey: string | null = null;

  /**
   * Set the API key for authentication
   */
  setApiKey(key: string) {
    this.apiKey = key;
    // Store in localStorage for persistence
    localStorage.setItem('startup_vision_api_key', key);
  }

  /**
   * Get the stored API key
   */
  getApiKey(): string | null {
    if (!this.apiKey) {
      // Try to get from localStorage
      this.apiKey = localStorage.getItem('startup_vision_api_key');
    }
    return this.apiKey;
  }

  /**
   * Clear the stored API key
   */
  clearApiKey() {
    this.apiKey = null;
    localStorage.removeItem('startup_vision_api_key');
  }

  /**
   * Check if the API key is set
   */
  hasApiKey(): boolean {
    return !!this.getApiKey();
  }

  /**
   * Generate response using OpenAI API
   */
  async generateResponse(messages: Message[]): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error("API key not set. Please set your API key in settings.");
    }

    try {
      // Format messages for API
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add system message to guide AI responses
      const systemMessage = {
        role: "system",
        content: "You are an AI business analyst assistant called StartupVision, specialized in helping students evaluate and improve business ideas. Provide constructive feedback, ask clarifying questions, and suggest improvements to business concepts. Be supportive but honest about potential challenges."
      };

      const request: ChatCompletionRequest = {
        model: "gpt-4o-mini", // Fixed model name from gpt-4o-mini to gpt-4o-mini
        messages: [systemMessage, ...formattedMessages],
        temperature: 0.7,
        max_tokens: 1000
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error (${response.status}): Request failed`);
      }

      const data = await response.json() as ChatCompletionResponse;
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error("No response generated from AI service.");
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error generating AI response:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to generate response: ${errorMessage}`);
    }
  }
}

// Create a singleton instance
const aiService = new AIService();
export default aiService;
