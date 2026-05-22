'use client';

import { Loader2, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background gap-4">
      <div className="relative flex items-center justify-center h-20 w-20">
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
        <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
