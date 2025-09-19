// AI Client Configuration
export * from './groq-client';

// AI Utilities
export * from './ai-utils';

// Backend Generator
export * from './backend-generator';

// Backend Analysis
export * from './backend-analysis';

// Type definitions for convenience
export type {
  AIMessage,
  AIStreamResponse,
  AIGenerationOptions,
  AIModel,
} from './ai-utils';

export type {
  UseAIOptions,
  UseAIReturn,
} from '@/hooks/use-ai';

export type {
  DatabaseField,
  DatabaseSchema,
  APIEndpoint,
  APIEndpointGroup,
  BackendGenerationResult,
} from './backend-generator';

export type {
  DatabaseRecommendation,
  PerformanceMetric,
  ScalingInsight,
  SmartRecommendation,
  OptimizationSuggestion,
  SecurityRecommendation,
  UseCase,
  BackendAnalysis,
} from './backend-analysis';
