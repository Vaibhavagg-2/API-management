'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
       <Card className="max-w-md w-full">
         <CardHeader>
            <CardTitle className="text-destructive">An Error Occurred</CardTitle>
            <CardDescription>Something went wrong on our end.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">We've been notified about the issue and are looking into it. Please try again.</p>
            <details className="text-xs text-muted-foreground/70">
                <summary>Error Details</summary>
                <p className="mt-2 font-mono bg-muted p-2 rounded-md">{error.message}</p>
            </details>
            <Button onClick={() => reset()} className="w-full">
                Try again
            </Button>
         </CardContent>
       </Card>
    </div>
  );
}
