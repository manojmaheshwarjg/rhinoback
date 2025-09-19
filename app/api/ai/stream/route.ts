import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@/lib/ai/groq-client';
import type { AIMessage, AIGenerationOptions } from '@/lib/ai/ai-utils';

export interface StreamRequest {
  prompt?: string;
  messages?: AIMessage[];
  systemMessage?: string;
  options?: AIGenerationOptions;
}

export async function POST(request: NextRequest) {
  try {
    const body: StreamRequest = await request.json();
    const { prompt, messages, systemMessage, options = {} } = body;

    let coreMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

    if (messages && messages.length > 0) {
      // Use provided messages
      coreMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
    } else if (prompt) {
      // Create messages from prompt and system message
      if (systemMessage) {
        coreMessages.push({
          role: 'system',
          content: systemMessage,
        });
      }
      coreMessages.push({
        role: 'user',
        content: prompt,
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'Either prompt or messages must be provided' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await streamText({
      model: groq(options.model || 'llama-3.3-70b-versatile'),
      messages: coreMessages,
      temperature: options.temperature ?? 1,
      maxTokens: options.maxTokens || 8192,
      topP: options.topP ?? 1,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('API Stream Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ 
      status: 'OK', 
      service: 'AI Streaming API (AI SDK)',
      timestamp: new Date().toISOString() 
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}