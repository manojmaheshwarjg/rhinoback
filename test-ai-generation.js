#!/usr/bin/env node

/**
 * Test script to verify AI backend generation works correctly
 * This script tests the core AI functionality with different use cases
 */

const { generateBackend } = require('./lib/ai/backend-generator.ts');

async function testBackendGeneration() {
  console.log('🧪 Testing AI Backend Generation...\n');

  const testCases = [
    {
      name: 'E-commerce Platform',
      description: 'An e-commerce platform with products, orders, users, categories, shopping cart, payments, reviews, inventory management, and supplier relationships.',
      expectedMinTables: 10,
      expectedMaxTables: 18
    },
    {
      name: 'Social Media App',
      description: 'A social media application where users can create posts, follow each other, like content, comment, share media, send messages, and create groups.',
      expectedMinTables: 8,
      expectedMaxTables: 15
    },
    {
      name: 'Blog Platform',
      description: 'A comprehensive blog platform with authors, articles, categories, tags, comments, user management, and analytics.',
      expectedMinTables: 6,
      expectedMaxTables: 12
    }
  ];

  for (const testCase of testCases) {
    console.log(`📝 Testing: ${testCase.name}`);
    console.log(`Description: ${testCase.description}`);
    
    try {
      const startTime = Date.now();
      
      const result = await generateBackend(testCase.description, {
        temperature: 0.7,
        maxTokens: 6000
      });
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      console.log(`⏱️  Generation time: ${duration.toFixed(2)}s`);
      
      if (!result.success) {
        console.log(`❌ FAILED: ${result.error}\n`);
        continue;
      }
      
      const tableCount = result.schemas?.length || 0;
      const endpointGroupCount = result.endpoints?.length || 0;
      
      console.log(`📊 Results:`);
      console.log(`   - Tables generated: ${tableCount}`);
      console.log(`   - Endpoint groups: ${endpointGroupCount}`);
      console.log(`   - Database: ${result.database}`);
      
      // Validate results
      const isValidTableCount = tableCount >= 6 && tableCount <= 20;
      const isInExpectedRange = tableCount >= testCase.expectedMinTables && tableCount <= testCase.expectedMaxTables;
      
      console.log(`✅ Validation:`);
      console.log(`   - Table count (6-20): ${isValidTableCount ? '✅' : '❌'} (${tableCount})`);
      console.log(`   - Expected range: ${isInExpectedRange ? '✅' : '❌'} (${testCase.expectedMinTables}-${testCase.expectedMaxTables})`);
      console.log(`   - Has endpoints: ${endpointGroupCount > 0 ? '✅' : '❌'}`);
      
      if (result.schemas && result.schemas.length > 0) {
        console.log(`📋 Sample tables: ${result.schemas.slice(0, 3).map(s => s.name).join(', ')}...`);
      }
      
      console.log(`${isValidTableCount && endpointGroupCount > 0 ? '✅ PASSED' : '❌ FAILED'}\n`);
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}\n`);
    }
  }
  
  console.log('🏁 Test complete!');
}

// Check if environment variables are set
if (!process.env.GROQ_API_KEY) {
  console.log('❌ GROQ_API_KEY environment variable is not set');
  process.exit(1);
}

testBackendGeneration().catch(console.error);