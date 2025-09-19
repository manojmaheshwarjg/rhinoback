import { useState, useCallback } from 'react';
import { useChat } from 'ai/react';
import type { AIMessage, AIGenerationOptions } from '@/lib/ai/ai-utils';

export interface UseAIOptions extends AIGenerationOptions {
  onError?: (error: string) => void;
  onSuccess?: (content: string) => void;
  onStreamChunk?: (chunk: string) => void;
  onStreamComplete?: (fullContent: string) => void;
}

export interface UseAIReturn {
  // State
  isLoading: boolean;
  error: string | null;
  content: string;
  isStreaming: boolean;
  
  // Actions
  generate: (prompt: string, systemMessage?: string, options?: AIGenerationOptions) => Promise<void>;
  generateWithMessages: (messages: AIMessage[], options?: AIGenerationOptions) => Promise<void>;
  generateStream: (prompt: string, systemMessage?: string, options?: AIGenerationOptions) => void;
  clear: () => void;
  
  // Chat functionality
  messages: Array<{ id: string; role: 'user' | 'assistant' | 'system'; content: string }>;
  append: (message: { content: string; role: 'user' | 'assistant' | 'system' }) => void;
}

export function useAI(initialOptions: UseAIOptions = {}): UseAIReturn {
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  
  const {
    onError,
    onSuccess,
    onStreamChunk,
    onStreamComplete,
    ...defaultOptions
  } = initialOptions;

  // Use AI SDK's useChat hook for streaming
  const {
    messages,
    append,
    isLoading: isChatLoading,
    error: chatError,
    setMessages,
  } = useChat({
    api: '/api/ai/stream',
    onError: (err) => {
      const errorMessage = err.message || 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
    },
    onFinish: (message) => {
      setContent(message.content);
      onSuccess?.(message.content);
      onStreamComplete?.(message.content);
    },
  });

  const [isStandardLoading, setIsStandardLoading] = useState(false);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    onError?.(errorMessage);
  }, [onError]);

  const generate = useCallback(async (
    prompt: string,
    systemMessage?: string,
    options: AIGenerationOptions = {}
  ) => {
    setIsStandardLoading(true);
    setError(null);
    setContent('');

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemMessage,
          options: { ...defaultOptions, ...options },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setContent(data.content);
      onSuccess?.(data.content);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      handleError(errorMessage);
    } finally {
      setIsStandardLoading(false);
    }
  }, [defaultOptions, onSuccess, handleError]);

  const generateWithMessages = useCallback(async (
    messages: AIMessage[],
    options: AIGenerationOptions = {}
  ) => {
    setIsStandardLoading(true);
    setError(null);
    setContent('');

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          options: { ...defaultOptions, ...options },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setContent(data.content);
      onSuccess?.(data.content);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      handleError(errorMessage);
    } finally {
      setIsStandardLoading(false);
    }
  }, [defaultOptions, onSuccess, handleError]);

  const generateStream = useCallback((
    prompt: string,
    systemMessage?: string,
    options: AIGenerationOptions = {}
  ) => {
    setError(null);
    setContent('');

    // Clear messages and start fresh conversation
    setMessages([]);

    // Add system message if provided
    if (systemMessage) {
      append({
        content: systemMessage,
        role: 'system',
      });
    }

    // Add user message and start streaming
    append({
      content: prompt,
      role: 'user',
    });
  }, [append, setMessages]);

  const clear = useCallback(() => {
    setContent('');
    setError(null);
    setMessages([]);
  }, [setMessages]);

  // Combine loading states
  const isLoading = isStandardLoading || isChatLoading;
  const isStreaming = isChatLoading;

  // Use chat error if available, otherwise use our local error
  const finalError = chatError?.message || error;

  return {
    // State
    isLoading,
    error: finalError,
    content: content || (messages.length > 0 ? messages[messages.length - 1]?.content || '' : ''),
    isStreaming,
    
    // Actions
    generate,
    generateWithMessages,
    generateStream,
    clear,
    
    // Chat functionality
    messages,
    append,
  };
}