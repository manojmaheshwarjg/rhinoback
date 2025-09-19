'use client';

import React, { useState } from 'react';
import { useAI } from '@/hooks/use-ai';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MessageSquare, Zap } from 'lucide-react';

export function AIChatExample() {
  const [prompt, setPrompt] = useState('');
  const [systemMessage, setSystemMessage] = useState('You are a helpful AI assistant.');

  const ai = useAI({
    onError: (error) => console.error('AI Error:', error),
    onSuccess: (content) => console.log('AI Success:', content),
    onStreamChunk: (chunk) => console.log('AI Stream Chunk:', chunk),
    onStreamComplete: (fullContent) => console.log('AI Stream Complete:', fullContent),
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    await ai.generate(prompt, systemMessage);
  };

  const handleGenerateStream = async () => {
    if (!prompt.trim()) return;
    await ai.generateStream(prompt, systemMessage);
  };

  const handleClear = () => {
    ai.clear();
    setPrompt('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Chat Example
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* System Message */}
          <div>
            <label htmlFor="system-message" className="block text-sm font-medium mb-2">
              System Message
            </label>
            <Textarea
              id="system-message"
              placeholder="Enter system message (optional)"
              value={systemMessage}
              onChange={(e) => setSystemMessage(e.target.value)}
              rows={2}
            />
          </div>

          {/* User Prompt */}
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              Your Message
            </label>
            <Textarea
              id="prompt"
              placeholder="Enter your message here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={handleGenerate} 
              disabled={ai.isLoading || !prompt.trim()}
              className="flex items-center gap-2"
            >
              {ai.isLoading && !ai.isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
              Generate
            </Button>
            
            <Button 
              onClick={handleGenerateStream} 
              disabled={ai.isLoading || !prompt.trim()}
              variant="outline"
              className="flex items-center gap-2"
            >
              {ai.isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              Stream Generate
            </Button>
            
            <Button 
              onClick={handleClear} 
              variant="destructive" 
              size="sm"
            >
              Clear
            </Button>
          </div>

          {/* Status */}
          {(ai.isLoading || ai.isStreaming) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {ai.isStreaming ? 'Streaming response...' : 'Generating response...'}
            </div>
          )}

          {/* Error Display */}
          {ai.error && (
            <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-md">
              <strong>Error:</strong> {ai.error}
            </div>
          )}

          {/* Response Display */}
          {ai.content && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-md">
                  {ai.content}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm">
          <ul>
            <li><strong>System Message:</strong> Sets the AI's behavior and context (optional)</li>
            <li><strong>Your Message:</strong> The prompt you want the AI to respond to</li>
            <li><strong>Generate:</strong> Gets a complete response all at once</li>
            <li><strong>Stream Generate:</strong> Gets the response as it's being generated (streaming)</li>
          </ul>
          
          <h4>Available AI Configuration:</h4>
          <ul>
            <li><strong>Model:</strong> {process.env.NEXT_PUBLIC_AI_MODEL || 'openai/gpt-oss-20b'}</li>
            <li><strong>Temperature:</strong> Controls randomness (0-2)</li>
            <li><strong>Max Tokens:</strong> Maximum response length</li>
            <li><strong>Reasoning Effort:</strong> Low, medium, or high</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}