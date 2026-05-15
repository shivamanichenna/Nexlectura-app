
'use client';

import { useEffect, useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { AlertCircle, X, WifiOff, ShieldAlert } from "lucide-react";
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

  const isOfflineError = error.message.toLowerCase().includes('offline') || 
                        error.message.toLowerCase().includes('unavailable');

  return (
    <div className="fixed inset-x-0 top-0 z-[100] p-4 flex justify-center animate-in fade-in slide-in-from-top-4">
      <Alert variant="destructive" className="max-w-md shadow-2xl border-2 bg-destructive text-destructive-foreground">
        {isOfflineError ? <WifiOff className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
        <div className="flex-1">
          <AlertTitle className="font-bold">
            {isOfflineError ? "Database Connection Error" : "Security Rule Denied"}
          </AlertTitle>
          <AlertDescription className="text-xs mt-1">
            <p className="mt-1 font-medium">{error.message}</p>
            <div className="mt-3 p-2 bg-white/10 rounded-lg space-y-2">
              <p className="font-bold uppercase text-[10px] tracking-widest text-white/60">Suggested Fixes:</p>
              <ul className="list-disc list-inside space-y-1 text-white/90 italic">
                {isOfflineError ? (
                  <>
                    <li>Ensure <b>Cloud Firestore</b> is enabled in Firebase Console.</li>
                    <li>Check if you created the database in <b>Production Mode</b> or <b>Test Mode</b>.</li>
                    <li>Verify your internet connection and Firebase Config in <b>.env</b>.</li>
                  </>
                ) : (
                  <>
                    <li>Check your <b>Firestore Security Rules</b> for the path: <span className="font-mono">{error.context.path}</span>.</li>
                    <li>Ensure your rules allow <b>{error.context.operation}</b> for authenticated users.</li>
                  </>
                )}
              </ul>
            </div>
          </AlertDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setError(null)}
          className="h-8 w-8 hover:bg-white/10 text-white shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  );
}
