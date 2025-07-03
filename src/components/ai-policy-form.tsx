'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateApiPolicy, type PolicyState } from '@/lib/actions';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialState: PolicyState = { message: null, policy: null, errors: {} };

function SubmitButton() {
  // `pending` is not available directly from useActionState in this React version
  // A workaround is to check for a specific state during submission
  // Or simply manage a local pending state.
  // For now, we'll rely on the form status. A real implementation would use form.formState.isSubmitting
  return (
    <Button type="submit" size="lg">
      <Wand2 />
      Generate Policies
    </Button>
  );
}

export function AiPolicyForm() {
  const [state, formAction] = useActionState(generateApiPolicy, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    if (state.message) {
      if (state.policy) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        formRef.current?.reset();
      } else {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast]);


  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <form ref={formRef} action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Describe Your API</CardTitle>
            <CardDescription>
              Provide details about your API to get tailored policy recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="apiFunctionality">API Functionality</Label>
              <Textarea
                id="apiFunctionality"
                name="apiFunctionality"
                placeholder="e.g., 'This API handles user authentication, profile management, and processes financial transactions.'"
                rows={4}
                required
              />
              {state.errors?.apiFunctionality && (
                <p className="text-sm text-destructive">{state.errors.apiFunctionality[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataSensitivity">Data Sensitivity</Label>
              <Textarea
                id="dataSensitivity"
                name="dataSensitivity"
                placeholder="e.g., 'Handles PII including names, addresses, and payment information.'"
                rows={3}
                required
              />
               {state.errors?.dataSensitivity && (
                <p className="text-sm text-destructive">{state.errors.dataSensitivity[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="complianceRequirements">Compliance Requirements</Label>
              <Textarea
                id="complianceRequirements"
                name="complianceRequirements"
                placeholder="e.g., 'Subject to GDPR and PCI-DSS compliance.'"
                rows={2}
                required
              />
               {state.errors?.complianceRequirements && (
                <p className="text-sm text-destructive">{state.errors.complianceRequirements[0]}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-bold font-headline">Suggested Policies</h2>
        <Card className="min-h-[400px]">
          <CardContent className="p-6">
            {state.policy ? (
              <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm font-code">
                {state.policy}
              </pre>
            ) : (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
                <Wand2 className="h-12 w-12 mb-4" />
                <p className="font-semibold">Your generated policies will appear here.</p>
                <p className="text-sm">Fill out the form to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
