import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { groq } from '@/lib/ai/groq-client';
import type { AIMessage, AIGenerationOptions } from '@/lib/ai/ai-utils';

export interface GenerateRequest {
  prompt?: string;
  messages?: AIMessage[];
  systemMessage?: string;
  options?: AIGenerationOptions;
}

export interface GenerateResponse {
  content: string;
  success: boolean;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: GenerateRequest = await request.json();
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
      return NextResponse.json(
        { 
          success: false, 
          error: 'Either prompt or messages must be provided',
          content: '' 
        },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: groq(options.model || 'meta-llama/llama-4-scout-17b-16e-instruct'),
      messages: coreMessages,
      temperature: options.temperature ?? 1,
      maxTokens: options.maxTokens || 8192,
      topP: options.topP ?? 1,
    });

    const response: GenerateResponse = {
      content: text,
      success: true,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('API Generate Error:', error);
    
    const errorResponse: GenerateResponse = {
      content: '',
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ 
    status: 'OK', 
    service: 'AI Generation API (AI SDK)',
    timestamp: new Date().toISOString() 
  });
}