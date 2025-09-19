import { AIChatExample } from '@/components/ai/ai-chat-example';

export default function TestAIPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        AI Backend Test Page
      </h1>
      <AIChatExample />
    </div>
  );
}