import { NextRequest, NextResponse } from 'next/server';
import { generateScalingInsights } from '@/lib/ai/scaling-insights';

export interface ScalingInsightsRequest {
  description: string;
  schemas?: any[];
  options?: {
    temperature?: number;
    maxTokens?: number;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: ScalingInsightsRequest = await request.json();
    
    if (!body.description?.trim()) {
      return NextResponse.json({
        insights: {
          expectedLoad: 'Medium',
          readWriteRatio: '70:30',
          cachingStrategy: 'Application-level',
          indexingPriority: []
        },
        metrics: [],
        success: false,
        error: 'Description is required',
      }, { status: 400 });
    }

    const result = await generateScalingInsights(
      body.description,
      body.schemas || [],
      body.options
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('Scaling Insights API Error:', error);
    
    return NextResponse.json({
      insights: {
        expectedLoad: 'Medium',
        readWriteRatio: '70:30',
        cachingStrategy: 'Application-level',
        indexingPriority: []
      },
      metrics: [],
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'OK',
    service: 'Scaling Insights API',
    description: 'Generate scaling insights and performance metrics from project descriptions',
    usage: {
      endpoint: 'POST /api/scaling-insights',
      body: {
        description: 'Project description',
        schemas: 'Optional array of database schemas',
        options: {
          temperature: 'AI creativity level (0-1, default: 0.3)',
          maxTokens: 'Maximum response length (default: 1500)',
        },
      },
    },
    timestamp: new Date().toISOString(),
  });
}