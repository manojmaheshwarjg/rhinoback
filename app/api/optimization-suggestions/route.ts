import { NextRequest, NextResponse } from 'next/server';
import { generateOptimizationSuggestions } from '@/lib/ai/optimization-suggestions';

export interface OptimizationSuggestionsRequest {
  description: string;
  schemas?: any[];
  options?: {
    temperature?: number;
    maxTokens?: number;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: OptimizationSuggestionsRequest = await request.json();
    
    if (!body.description?.trim()) {
      return NextResponse.json({
        suggestions: [],
        success: false,
        error: 'Description is required',
      }, { status: 400 });
    }

    const result = await generateOptimizationSuggestions(
      body.description,
      body.schemas || [],
      body.options
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('Optimization Suggestions API Error:', error);
    
    return NextResponse.json({
      suggestions: [],
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'OK',
    service: 'Optimization Suggestions API',
    description: 'Generate optimization suggestions from project descriptions',
    usage: {
      endpoint: 'POST /api/optimization-suggestions',
      body: {
        description: 'Project description',
        schemas: 'Optional array of database schemas',
        options: {
          temperature: 'AI creativity level (0-1, default: 0.3)',
          maxTokens: 'Maximum response length (default: 2000)',
        },
      },
    },
    timestamp: new Date().toISOString(),
  });
}