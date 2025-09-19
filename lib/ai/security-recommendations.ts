import { generateText } from 'ai';
import { groq, AI_CONFIG } from './groq-client';

export interface SecurityRecommendation {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  category: 'authentication' | 'authorization' | 'data' | 'infrastructure';
}

export interface SecurityRecommendationsResult {
  recommendations: SecurityRecommendation[];
  success: boolean;
  error?: string;
}

const SECURITY_RECOMMENDATIONS_PROMPT = `You are a cybersecurity expert. Analyze the project requirements and provide essential security recommendations.

CRITICAL: Respond with ONLY valid JSON in the exact format below.

**REQUIRED JSON STRUCTURE:**
{
  "recommendations": [
    {
      "title": "Specific security measure",
      "description": "How to implement and why it's needed for security",
      "priority": "High|Medium|Low",
      "category": "authentication|authorization|data|infrastructure"
    }
  ],
  "success": true
}

**REQUIREMENTS:**
1. Generate 4-6 security recommendations relevant to the project
2. Each recommendation must be specific and actionable
3. Provide clear implementation guidance and security benefits
4. Set appropriate priority levels based on security impact
5. Cover different security areas: auth, data protection, infrastructure
6. Focus on practical, implementable security measures

**SECURITY CATEGORIES:**
- authentication: User login, password policies, MFA
- authorization: Role-based access, permissions, API security
- data: Encryption, data privacy, secure storage
- infrastructure: Network security, server hardening, monitoring

Return ONLY the JSON object with no additional formatting or text.`;

export async function generateSecurityRecommendations(
  description: string,
  schemas: any[] = [],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<SecurityRecommendationsResult> {
  if (!description?.trim()) {
    return {
      recommendations: [],
      success: false,
      error: 'Description is required',
    };
  }

  try {
    const prompt = `${SECURITY_RECOMMENDATIONS_PROMPT}

**PROJECT DESCRIPTION:** "${description}"
**GENERATED TABLES:** ${schemas.map(s => s.name).join(', ')}

Provide security recommendations tailored to this specific project.`;

    const { text } = await generateText({
      model: groq(AI_CONFIG.model),
      messages: [
        { role: 'system', content: prompt },
        { 
          role: 'user', 
          content: `Provide security recommendations for: ${description}`
        },
      ],
      temperature: options.temperature ?? 0.2,
      maxTokens: options.maxTokens || 2000,
      topP: 0.9,
    });

    const result = JSON.parse(text.trim());
    
    if (!result.recommendations || !Array.isArray(result.recommendations)) {
      throw new Error('Invalid response: recommendations array is required');
    }

    // Ensure all fields are present with defaults
    const recommendations = result.recommendations.map((rec: any) => ({
      title: rec.title || 'General Security Measure',
      description: rec.description || 'Security implementation details not specified',
      priority: rec.priority || 'Medium',
      category: rec.category || 'authentication'
    }));

    return {
      recommendations,
      success: true,
    };

  } catch (error) {
    console.error('Security Recommendations Error:', error);
    
    return {
      recommendations: [
        {
          title: 'Implement Strong Authentication',
          description: 'Use secure password policies and consider implementing multi-factor authentication for enhanced security.',
          priority: 'High',
          category: 'authentication'
        },
        {
          title: 'Role-Based Access Control',
          description: 'Implement proper authorization system with role-based permissions to control user access.',
          priority: 'High',
          category: 'authorization'
        },
        {
          title: 'Data Encryption',
          description: 'Encrypt sensitive data both at rest and in transit using industry-standard encryption.',
          priority: 'High',
          category: 'data'
        },
        {
          title: 'Security Monitoring',
          description: 'Set up comprehensive logging and monitoring to detect and respond to security incidents.',
          priority: 'Medium',
          category: 'infrastructure'
        }
      ],
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate security recommendations',
    };
  }
}