import { config } from 'dotenv';
import { generateSimpleJSON, chatCompletion } from './lib/ai/ai-utils';
import { AI_CONFIG } from './lib/ai/groq-client';

// Load environment variables
config();

async function testNewModel() {
  console.log('=== Testing Updated Model Configuration ===\n');
  
  console.log(`Current Model: ${AI_CONFIG.model}`);
  console.log(`Max Tokens: ${AI_CONFIG.maxTokens}`);
  console.log(`Temperature: ${AI_CONFIG.temperature}`);
  console.log(`Top P: ${AI_CONFIG.topP}\n`);

  // Verify configuration
  console.log('Expected Configuration:');
  console.log('- Model: meta-llama/llama-4-scout-17b-16e-instruct');
  console.log('- Max Tokens: 8192');
  console.log('- Temperature: 1');
  console.log('- Top P: 1\n');

  try {
    // Test 1: Simple text completion
    console.log('Test 1: Text Completion');
    console.log('Prompt: "What are the key features of TypeScript?"');
    
    const textResponse = await chatCompletion(
      "What are the key features of TypeScript? Keep it brief.",
      "You are a helpful programming assistant."
    );
    
    console.log('Response:', textResponse);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: JSON response (equivalent to response_format: {"type": "json_object"})
    console.log('Test 2: JSON Response');
    console.log('Prompt: "Create a simple JSON object about JavaScript frameworks"');
    
    const jsonResponse = await generateSimpleJSON(
      "Create a JSON object with 3 popular JavaScript frameworks. Include name, description, and year_created for each."
    );
    
    console.log('JSON Response:', JSON.stringify(jsonResponse, null, 2));
    console.log('\n' + '='.repeat(50) + '\n');

    console.log('All tests completed successfully!');

  } catch (error) {
    console.error('Test failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('GROQ_API_KEY')) {
        console.log('\nMake sure your .env file contains: GROQ_API_KEY=your_api_key_here');
      }
    }
  }
}

// Run the test
testNewModel();