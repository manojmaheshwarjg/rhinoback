import { z } from 'zod';
import { 
  generateAI, 
  generateJSONCompletion, 
  generateSimpleJSON,
  chatCompletion,
  type AIMessage 
} from '../lib/ai/ai-utils';

// Example 1: Using the new model for regular text completion
export async function exampleTextCompletion() {
  const response = await chatCompletion(
    "Explain what a REST API is in simple terms.",
    "You are a helpful programming tutor."
  );
  
  console.log("Text Response:", response);
  return response;
}

// Example 2: Using structured JSON with schema validation (recommended approach)
export async function exampleStructuredJSON() {
  const PersonSchema = z.object({
    name: z.string(),
    age: z.number(),
    skills: z.array(z.string()),
    experience_level: z.enum(['beginner', 'intermediate', 'advanced'])
  });

  const messages: AIMessage[] = [
    {
      role: 'system',
      content: 'You are helping to create developer profiles.'
    },
    {
      role: 'user', 
      content: 'Create a profile for a JavaScript developer named John who has 5 years of experience.'
    }
  ];

  const profile = await generateJSONCompletion(messages, PersonSchema);
  console.log("Structured JSON Response:", profile);
  return profile;
}

// Example 3: Simple JSON without schema (similar to your original approach)
export async function exampleSimpleJSON() {
  const response = await generateSimpleJSON(
    "Create a JSON object with information about the latest web development trends. Include at least 3 trends with descriptions."
  );
  
  console.log("Simple JSON Response:", response);
  return response;
}

// Example 4: Direct usage with custom options (most similar to your original code)
export async function exampleWithCustomOptions() {
  const messages: AIMessage[] = [
    {
      role: 'user',
      content: 'Explain the benefits of TypeScript over JavaScript in JSON format.'
    }
  ];

  // This is equivalent to your original approach
  const response = await generateAI(messages, {
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    temperature: 1,
    maxTokens: 1024,
    topP: 1
  });

  // Parse manually if you expect JSON
  try {
    const jsonResponse = JSON.parse(response);
    console.log("Custom Options JSON Response:", jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.log("Plain Text Response:", response);
    return response;
  }
}

// Test all examples
export async function runAllExamples() {
  console.log("=== Model Usage Examples ===\n");

  try {
    console.log("1. Text Completion:");
    await exampleTextCompletion();
    console.log("\n");

    console.log("2. Structured JSON (Recommended):");
    await exampleStructuredJSON();
    console.log("\n");

    console.log("3. Simple JSON:");
    await exampleSimpleJSON();
    console.log("\n");

    console.log("4. Custom Options:");
    await exampleWithCustomOptions();
    console.log("\n");

  } catch (error) {
    console.error("Example failed:", error);
  }
}