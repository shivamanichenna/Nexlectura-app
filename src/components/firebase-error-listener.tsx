'use client';

import { useEffect, useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FirebaseErrorListener() {
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    const handleError = (err: FirestorePermissionError) => {
      setError(err);
    };

    errorEmitter.on('permission-error', handleError);
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  if (!error) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] p-4 flex justify-center animate-in fade-in slide-in-from-top-4">
      <Alert variant="destructive" className="max-w-md shadow-2xl border-2 bg-destructive text-destructive-foreground">
        <AlertCircle className="h-5 w-5" />
        <div className="flex-1">
          <AlertTitle className="font-bold">Security Rule Denied</AlertTitle>
          <AlertDescription className="text-xs mt-1">
            <p>Operation: <span className="font-mono bg-white/20 px-1 rounded">{error.context.operation}</span></p>
            <p className="mt-1 truncate">Path: <span className="font-mono bg-white/20 px-1 rounded">{error.context.path}</span></p>
            <p className="mt-2 leading-relaxed italic text-white/80 font-medium">
              This request was blocked by Firestore Security Rules. Ensure your rules allow this operation for your current role.
            </p>
          </AlertDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setError(null)}
          className="h-8 w-8 hover:bg-white/10 text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  );
}
