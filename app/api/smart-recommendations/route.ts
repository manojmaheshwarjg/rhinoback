import { NextRequest, NextResponse } from 'next/server';
import { generateSmartRecommendations } from '@/lib/ai/smart-recommendations';

export interface SmartRecommendationsRequest {
  description: string;
  schemas?: any[];
  options?: {
    temperature?: number;
    maxTokens?: number;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: SmartRecommendationsRequest = await request.json();
    
    if (!body.description?.trim()) {
      return NextResponse.json({
        recommendations: [],
        success: false,
        error: 'Description is required',
      }, { status: 400 });
    }

    const result = await generateSmartRecommendations(
      body.description,
      body.schemas || [],
      body.options
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('Smart Recommendations API Error:', error);
    
    return NextResponse.json({
      recommendations: [],
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'OK',
    service: 'Smart Recommendations API',
    description: 'Generate smart architectural recommendations from project descriptions',
    usage: {
      endpoint: 'POST /api/smart-recommendations',
      body: {
        description: 'Project description',
        schemas: 'Optional array of database schemas',
        options: {
          temperature: 'AI creativity level (0-1, default: 0.4)',
          maxTokens: 'Maximum response length (default: 2000)',
        },
      },
    },
    timestamp: new Date().toISOString(),
  });
}