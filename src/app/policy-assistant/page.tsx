import { AiPolicyForm } from '@/components/ai-policy-form';
import { Sparkles } from 'lucide-react';

export default function PolicyAssistantPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
        </div>
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              AI Policy Assistant
            </h1>
            <p className="text-muted-foreground">
              Generate optimal security and governance policies for your API.
            </p>
        </div>
      </div>
      
      <AiPolicyForm />
    </div>
  );
}
