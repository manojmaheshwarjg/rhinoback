import { generateText } from 'ai';
import { groq, AI_CONFIG } from './groq-client';

export interface DatabaseRecommendation {
  name: string;
  score: number;
  reasons: string[];
  bestFor: string;
  pros: string[];
  cons: string[];
  whyForUseCase: string[];
}

export interface PerformanceMetric {
  label: string;
  value: string;
  description: string;
}

export interface ScalingInsight {
  expectedLoad: 'Low' | 'Medium' | 'High';
  readWriteRatio: string;
  cachingStrategy: string;
  indexingPriority: Array<{
    table: string;
    priority: 'Low' | 'Medium' | 'High';
    reason: string;
  }>;
}

export interface SmartRecommendation {
  title: string;
  description: string;
  type: string;
  priority: 'Low' | 'Medium' | 'High';
  implementationEffort: 'Low' | 'Medium' | 'High';
}

export interface OptimizationSuggestion {
  type: string;
  title: string;
  description: string;
  impact: 'Low' | 'Medium' | 'High';
  complexity: 'Low' | 'Medium' | 'High';
}

export interface SecurityRecommendation {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  category: string;
}

export interface UseCase {
  key: string;
  label: string;
  features: string[];
  complexity: 'simple' | 'medium' | 'complex';
}

export interface BackendAnalysis {
  useCase: UseCase;
  databaseRecommendations: DatabaseRecommendation[];
  performanceMetrics: PerformanceMetric[];
  scalingInsights: ScalingInsight;
  smartRecommendations: SmartRecommendation[];
  optimizationSuggestions: OptimizationSuggestion[];
  securityRecommendations: SecurityRecommendation[];
  success: boolean;
  error?: string;
}

const BACKEND_ANALYSIS_PROMPT = `You are a senior backend architect and database expert. Analyze the user's project requirements and provide comprehensive technical recommendations.

CRITICAL: Respond with ONLY valid JSON in the exact format specified.

Analyze this project description and generate detailed technical recommendations:

**REQUIRED JSON STRUCTURE:**
{
  "useCase": {
    "key": "social|ecommerce|blog|tasks|saas|analytics|gaming|etc",
    "label": "Human readable use case name",
    "features": ["key feature 1", "key feature 2", "key feature 3"],
    "complexity": "simple|medium|complex"
  },
  "databaseRecommendations": [
    {
      "name": "PostgreSQL|MySQL|MongoDB|Redis|etc",
      "score": 85,
      "reasons": ["specific technical reason 1", "specific reason 2"],
      "bestFor": "what this DB excels at for this use case",
      "pros": ["advantage 1", "advantage 2", "advantage 3"],
      "cons": ["limitation 1", "limitation 2"],
      "whyForUseCase": ["use case specific reason 1", "use case specific reason 2"]
    }
  ],
  "performanceMetrics": [
    {
      "label": "Expected QPS",
      "value": "1000-5000",
      "description": "Queries per second estimate"
    },
    {
      "label": "Data Growth",
      "value": "500GB/year",
      "description": "Estimated data growth"
    }
  ],
  "scalingInsights": {
    "expectedLoad": "Low|Medium|High",
    "readWriteRatio": "80:20",
    "cachingStrategy": "Redis + CDN|Application-level|etc",
    "indexingPriority": [
      {
        "table": "table_name",
        "priority": "High|Medium|Low",
        "reason": "why this table needs priority indexing"
      }
    ]
  },
  "smartRecommendations": [
    {
      "title": "Specific recommendation title",
      "description": "Detailed technical implementation advice",
      "type": "architecture|performance|security|scalability",
      "priority": "High|Medium|Low",
      "implementationEffort": "Low|Medium|High"
    }
  ],
  "optimizationSuggestions": [
    {
      "type": "indexing|caching|monitoring|backup|etc",
      "title": "Optimization technique",
      "description": "How to implement and why it helps",
      "impact": "High|Medium|Low",
      "complexity": "Low|Medium|High"
    }
  ],
  "securityRecommendations": [
    {
      "title": "Security measure",
      "description": "How to implement and why it's needed",
      "priority": "High|Medium|Low",
      "category": "authentication|authorization|data|infrastructure"
    }
  ],
  "success": true
}

**ANALYSIS REQUIREMENTS:**
1. Determine use case from description (social, ecommerce, blog, saas, analytics, gaming, etc.)
2. Recommend 3-4 databases with realistic scores based on the specific use case
3. Provide performance estimates appropriate to the scale described
4. Generate scaling insights that match the expected usage patterns
5. Create 3-4 smart recommendations tailored to the specific use case
6. Suggest 4-6 optimization techniques relevant to the architecture
7. Recommend 3-4 security measures appropriate to the data sensitivity

**USE CASE EXAMPLES:**
- Social platform: High write bursts, graph relationships, real-time features
- E-commerce: ACID transactions, catalog search, inventory management
- Blog/CMS: SEO optimization, content workflow, caching
- SaaS tool: Multi-tenancy, APIs, user management
- Analytics: Time-series data, aggregations, reporting
- Gaming: Real-time updates, leaderboards, user sessions

**MAKE IT SPECIFIC:** Don't use generic advice. Tailor everything to the exact use case and requirements mentioned in the description.

Return ONLY the JSON object with no additional formatting or text.`;

export async function analyzeBackendRequirements(
  userDescription: string,
  schemas: any[],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<BackendAnalysis> {
  if (!userDescription?.trim()) {
    return {
      useCase: { key: 'generic', label: 'General Application', features: [], complexity: 'simple' },
      databaseRecommendations: [],
      performanceMetrics: [],
      scalingInsights: { expectedLoad: 'Low', readWriteRatio: '70:30', cachingStrategy: 'Application-level', indexingPriority: [] },
      smartRecommendations: [],
      optimizationSuggestions: [],
      securityRecommendations: [],
      success: false,
      error: 'Description is required',
    };
  }

  try {
    const analysisPrompt = `${BACKEND_ANALYSIS_PROMPT}

**PROJECT DESCRIPTION:** "${userDescription}"

**GENERATED TABLES:** ${schemas.map(s => s.name).join(', ')}

Provide comprehensive analysis and recommendations for this specific project.`;

    const { text } = await generateText({
      model: groq(AI_CONFIG.model),
      messages: [
        {
          role: 'system',
          content: analysisPrompt,
        },
        {
          role: 'user',
          content: `Analyze this backend project and provide tailored technical recommendations: ${userDescription}`,
        },
      ],
      temperature: options.temperature ?? 0.3, // Lower temperature for more consistent technical advice
      maxTokens: options.maxTokens || 4000,
      topP: 0.9,
    });

    // Parse the JSON response
    const result = JSON.parse(text.trim());
    
    // Validate required fields
    if (!result.useCase || !result.databaseRecommendations) {
      throw new Error('Invalid response: missing required fields');
    }

    return {
      useCase: result.useCase,
      databaseRecommendations: result.databaseRecommendations || [],
      performanceMetrics: result.performanceMetrics || [],
      scalingInsights: result.scalingInsights || { expectedLoad: 'Medium', readWriteRatio: '70:30', cachingStrategy: 'Application-level', indexingPriority: [] },
      smartRecommendations: result.smartRecommendations || [],
      optimizationSuggestions: result.optimizationSuggestions || [],
      securityRecommendations: result.securityRecommendations || [],
      success: true,
    };

  } catch (error) {
    console.error('Backend Analysis Error:', error);
    
    return {
      useCase: { key: 'generic', label: 'General Application', features: [], complexity: 'simple' },
      databaseRecommendations: [],
      performanceMetrics: [],
      scalingInsights: { expectedLoad: 'Low', readWriteRatio: '70:30', cachingStrategy: 'Application-level', indexingPriority: [] },
      smartRecommendations: [],
      optimizationSuggestions: [],
      securityRecommendations: [],
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze backend requirements',
    };
  }
}