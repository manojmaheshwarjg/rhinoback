import { generateText, streamText, generateObject, type CoreMessage } from 'ai';
import { groq, AI_CONFIG } from './groq-client';
import { z } from 'zod';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIStreamResponse {
  content: string;
  isComplete: boolean;
  error?: string;
}

export interface AIGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stream?: boolean;
  stop?: string | string[];
}

/**
 * Convert AIMessage to CoreMessage format
 */
function convertMessages(messages: AIMessage[]): CoreMessage[] {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));
}

/**
 * Generate AI completion using AI SDK
 */
export async function generateAI(
  messages: AIMessage[],
  options: AIGenerationOptions = {}
): Promise<string> {
  try {
    const coreMessages = convertMessages(messages);
    
    const { text } = await generateText({
      model: groq(options.model || AI_CONFIG.model),
      messages: coreMessages,
      temperature: options.temperature ?? AI_CONFIG.temperature,
      maxTokens: options.maxTokens || AI_CONFIG.maxTokens,
      topP: options.topP ?? AI_CONFIG.topP,
    });

    return text;
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate AI completion with streaming using AI SDK
 */
export async function* generateAIStream(
  messages: AIMessage[],
  options: AIGenerationOptions = {}
): AsyncGenerator<AIStreamResponse> {
  try {
    const coreMessages = convertMessages(messages);
    
    const { textStream } = await streamText({
      model: groq(options.model || AI_CONFIG.model),
      messages: coreMessages,
      temperature: options.temperature ?? AI_CONFIG.temperature,
      maxTokens: options.maxTokens || AI_CONFIG.maxTokens,
      topP: options.topP ?? AI_CONFIG.topP,
    });

    for await (const chunk of textStream) {
      yield {
        content: chunk,
        isComplete: false,
      };
    }

    yield {
      content: '',
      isComplete: true,
    };

  } catch (error) {
    console.error('AI Stream Generation Error:', error);
    yield {
      content: '',
      isComplete: true,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Simple text completion utility
 */
export async function completeText(
  prompt: string,
  options: AIGenerationOptions = {}
): Promise<string> {
  const messages: AIMessage[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  return generateAI(messages, options);
}

/**
 * Chat completion with system message
 */
export async function chatCompletion(
  userMessage: string,
  systemMessage?: string,
  options: AIGenerationOptions = {}
): Promise<string> {
  const messages: AIMessage[] = [];

  if (systemMessage) {
    messages.push({
      role: 'system',
      content: systemMessage,
    });
  }

  messages.push({
    role: 'user',
    content: userMessage,
  });

  return generateAI(messages, options);
}

/**
 * Multi-turn conversation completion
 */
export async function conversationCompletion(
  conversation: AIMessage[],
  options: AIGenerationOptions = {}
): Promise<string> {
  return generateAI(conversation, options);
}

/**
 * Streaming chat completion
 */
export async function* streamChatCompletion(
  userMessage: string,
  systemMessage?: string,
  options: AIGenerationOptions = {}
): AsyncGenerator<AIStreamResponse> {
  const messages: AIMessage[] = [];

  if (systemMessage) {
    messages.push({
      role: 'system',
      content: systemMessage,
    });
  }

  messages.push({
    role: 'user',
    content: userMessage,
  });

  yield* generateAIStream(messages, options);
}

/**
 * Generate structured JSON response using AI SDK
 * This is the equivalent of using response_format: {"type": "json_object"}
 */
export async function generateJSONCompletion<T>(
  messages: AIMessage[],
  schema: z.ZodSchema<T>,
  options: AIGenerationOptions = {}
): Promise<T> {
  try {
    const coreMessages = convertMessages(messages);
    
    const { object } = await generateObject({
      model: groq(options.model || AI_CONFIG.model),
      messages: coreMessages,
      schema,
      temperature: options.temperature ?? AI_CONFIG.temperature,
      maxTokens: options.maxTokens || AI_CONFIG.maxTokens,
    });

    return object;
  } catch (error) {
    console.error('AI JSON Generation Error:', error);
    throw new Error(`AI JSON generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Simple JSON completion with automatic schema inference
 */
export async function generateSimpleJSON(
  prompt: string,
  options: AIGenerationOptions = {}
): Promise<any> {
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: 'You must respond with valid JSON only. Do not include any explanations or additional text outside the JSON.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  try {
    const response = await generateAI(messages, options);
    return JSON.parse(response);
  } catch (error) {
    console.error('JSON parsing error:', error);
    throw new Error(`Failed to generate valid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
