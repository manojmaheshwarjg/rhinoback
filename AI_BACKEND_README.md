# AI Backend Setup with Groq

This document explains how to use the AI backend powered by Groq in your Next.js application.

## Setup Complete ✅

The AI backend has been fully configured with:

- **Groq SDK**: Added to package.json dependencies
- **Environment Variables**: Configured in `.env.local`
- **AI Service**: Centralized client configuration
- **API Routes**: Both standard and streaming endpoints
- **React Hook**: Easy-to-use client-side integration
- **Example Component**: Complete usage demonstration

## Environment Variables

Your `.env.local` file contains:

```env
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# AI Configuration
AI_MODEL=openai/gpt-oss-20b
AI_TEMPERATURE=1
AI_MAX_TOKENS=8192
AI_TOP_P=1
AI_REASONING_EFFORT=medium
```

## File Structure

```
lib/ai/
├── groq-client.ts          # Groq client configuration
├── ai-utils.ts             # AI generation utilities
└── index.ts                # Exports

app/api/ai/
├── generate/route.ts       # Standard generation API
└── stream/route.ts         # Streaming generation API

hooks/
└── use-ai.ts               # React hook for AI integration

components/ai/
└── ai-chat-example.tsx     # Example usage component
```

## Usage Examples

### 1. Using the React Hook (Recommended)

```tsx
import { useAI } from '@/hooks/use-ai';

function MyComponent() {
  const ai = useAI({
    onError: (error) => console.error('AI Error:', error),
    onSuccess: (content) => console.log('Generated:', content),
  });

  const handleGenerate = async () => {
    await ai.generate('Write a haiku about coding');
  };

  const handleStream = async () => {
    await ai.generateStream('Tell me a story about AI');
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={ai.isLoading}>
        Generate
      </button>
      <button onClick={handleStream} disabled={ai.isLoading}>
        Stream Generate
      </button>
      {ai.content && <div>{ai.content}</div>}
      {ai.error && <div>Error: {ai.error}</div>}
    </div>
  );
}
```

### 2. Using API Routes Directly

#### Standard Generation

```typescript
const response = await fetch('/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Write a haiku about coding',
    systemMessage: 'You are a creative poet',
    options: {
      temperature: 0.8,
      maxTokens: 100
    }
  })
});

const data = await response.json();
console.log(data.content);
```

#### Streaming Generation

```typescript
const response = await fetch('/api/ai/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Tell me a story',
    options: { temperature: 0.7 }
  })
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      console.log(data.content); // Stream chunk
      if (data.isComplete) break;
    }
  }
}
```

### 3. Using AI Utilities Directly (Server-side)

```typescript
import { chatCompletion, generateAIStream } from '@/lib/ai/ai-utils';

// Simple completion
const response = await chatCompletion(
  'What is the meaning of life?',
  'You are a philosophical AI assistant'
);

// Streaming completion
for await (const chunk of generateAIStream([
  { role: 'user', content: 'Tell me a joke' }
])) {
  console.log(chunk.content);
  if (chunk.isComplete) break;
}
```

## Available Methods

### React Hook (useAI)

- `generate(prompt, systemMessage?, options?)` - Standard generation
- `generateStream(prompt, systemMessage?, options?)` - Streaming generation  
- `generateWithMessages(messages, options?)` - Multi-turn conversation
- `generateStreamWithMessages(messages, options?)` - Streaming conversation
- `clear()` - Clear content and error state
- `addMessage(message)` - Add message to conversation history

### AI Utilities

- `chatCompletion(userMessage, systemMessage?, options?)` - Simple chat
- `completeText(prompt, options?)` - Text completion
- `conversationCompletion(messages, options?)` - Multi-turn chat
- `generateAI(messages, options?)` - Core generation function
- `generateAIStream(messages, options?)` - Core streaming function
- `streamChatCompletion(userMessage, systemMessage?, options?)` - Streaming chat

## Configuration Options

```typescript
interface AIGenerationOptions {
  model?: string;              // AI model to use
  temperature?: number;        // 0-2, controls randomness
  maxTokens?: number;         // Maximum response length
  topP?: number;              // 0-1, controls diversity
  reasoningEffort?: string;   // 'low' | 'medium' | 'high'
  stream?: boolean;           // Enable streaming
  stop?: string | string[];   // Stop sequences
}
```

## Example Component

Check out `components/ai/ai-chat-example.tsx` for a complete example with:
- System message configuration
- Both standard and streaming generation
- Error handling
- Loading states
- Response display

## Next Steps

1. **Install Dependencies**: Run `npm install` to install the groq-sdk
2. **Test the Setup**: Use the example component to verify everything works
3. **Customize**: Modify the AI configuration in `.env.local` as needed
4. **Build Your Features**: Use the AI utilities in your components

## Available Models

The current setup uses `openai/gpt-oss-20b`, but Groq supports many models:
- OpenAI compatible models
- Llama models  
- Mixtral models
- Gemma models

Check the [Groq documentation](https://console.groq.com/docs/models) for the latest available models.

## Security Notes

- The API key is stored securely in environment variables
- Server-side API routes handle all Groq communication
- No API keys are exposed to the client side
- All requests are validated and error-handled

## Troubleshooting

1. **API Key Issues**: Verify your GROQ_API_KEY in `.env.local`
2. **Model Issues**: Check if the model name is correct and available
3. **Rate Limits**: Groq has rate limits - implement retry logic if needed
4. **CORS Issues**: The streaming endpoint includes CORS headers

Your AI backend is now ready to use! 🚀