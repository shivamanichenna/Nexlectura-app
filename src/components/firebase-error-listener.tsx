
'use client';

import { useEffect, useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { AlertCircle, X, WifiOff, ShieldAlert, RefreshCw, ExternalLink } from "lucide-react";
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
                        error.message.toLowerCase().includes('unavailable') ||
                        error.message.toLowerCase().includes('connection');

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-x-0 top-0 z-[100] p-4 flex justify-center animate-in fade-in slide-in-from-top-4">
      <Alert variant="destructive" className="max-w-md shadow-2xl border-2 bg-destructive text-destructive-foreground">
        {isOfflineError ? <WifiOff className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
        <div className="flex-1">
          <AlertTitle className="font-bold flex items-center justify-between">
            {isOfflineError ? "Database Connection Error" : "Security Rule Denied"}
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded ml-2">Error 403/503</span>
          </AlertTitle>
          <AlertDescription className="text-xs mt-1">
            <p className="mt-1 font-medium leading-relaxed">{error.message}</p>
            <div className="mt-3 p-3 bg-white/10 rounded-xl space-y-2 border border-white/10">
              <p className="font-bold uppercase text-[10px] tracking-widest text-white/70">Required Actions:</p>
              <ul className="list-disc list-inside space-y-1.5 text-white/90">
                {isOfflineError ? (
                  <>
                    <li>Go to <b>Firestore Database</b> in Console and click <b>"Create Database"</b>.</li>
                    <li>Ensure your <b>Project ID</b> in <code className="bg-black/20 px-1 rounded">.env</code> is exactly correct.</li>
                    <li>Set rules to <b>"Test Mode"</b> temporarily to verify connection.</li>
                  </>
                ) : (
                  <>
                    <li>Check rules for path: <code className="bg-black/20 px-1 rounded">{error.context.path}</code></li>
                    <li>Ensure you are <b>Logged In</b> if the rule requires <code className="bg-black/20 px-1 rounded">auth != null</code>.</li>
                  </>
                )}
              </ul>
            </div>
            <div className="mt-4 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white font-bold h-9 rounded-lg gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Retry Connection
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                className="text-white/80 hover:text-white h-9 gap-1.5"
              >
                <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
                  Console <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </AlertDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setError(null)}
          className="h-8 w-8 hover:bg-white/10 text-white shrink-0 -mt-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  );
}
