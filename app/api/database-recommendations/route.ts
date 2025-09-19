import { NextRequest, NextResponse } from 'next/server';
import { generateDatabaseRecommendations } from '@/lib/ai/database-recommendations';

export interface DatabaseRecommendationsRequest {
  description: string;
  schemas?: any[];
  options?: {
    temperature?: number;
    maxTokens?: number;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: DatabaseRecommendationsRequest = await request.json();
    
    if (!body.description?.trim()) {
      return NextResponse.json({
        useCase: { key: 'generic', label: 'General Application', features: [], complexity: 'simple' },
        recommendations: [],
        selected: 'PostgreSQL',
        success: false,
        error: 'Description is required',
      }, { status: 400 });
    }

    const result = await generateDatabaseRecommendations(
      body.description,
      body.schemas || [],
      body.options
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('Database Recommendations API Error:', error);
    
    return NextResponse.json({
      useCase: { key: 'generic', label: 'General Application', features: [], complexity: 'simple' },
      recommendations: [],
      selected: 'PostgreSQL',
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'OK',
    service: 'Database Recommendations API',
    description: 'Generate database recommendations from project descriptions',
    usage: {
      endpoint: 'POST /api/database-recommendations',
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