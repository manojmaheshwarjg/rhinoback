import { NextRequest, NextResponse } from 'next/server';
import { generateSecurityRecommendations } from '@/lib/ai/security-recommendations';

export interface SecurityRecommendationsRequest {
  description: string;
  schemas?: any[];
  options?: {
    temperature?: number;
    maxTokens?: number;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: SecurityRecommendationsRequest = await request.json();
    
    if (!body.description?.trim()) {
      return NextResponse.json({
        recommendations: [],
        success: false,
        error: 'Description is required',
      }, { status: 400 });
    }

    const result = await generateSecurityRecommendations(
      body.description,
      body.schemas || [],
      body.options
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('Security Recommendations API Error:', error);
    
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
    service: 'Security Recommendations API',
    description: 'Generate security recommendations from project descriptions',
    usage: {
      endpoint: 'POST /api/security-recommendations',
      body: {
        description: 'Project description',
        schemas: 'Optional array of database schemas',
        options: {
          temperature: 'AI creativity level (0-1, default: 0.2)',
          maxTokens: 'Maximum response length (default: 2000)',
        },
      },
    },
    timestamp: new Date().toISOString(),
  });
}