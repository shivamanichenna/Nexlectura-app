'use client';

import React, { useEffect, useState } from 'react';
import { initializeFirebase } from './config';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [instances, setInstances] = useState<{
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
    storage: FirebaseStorage;
  } | null>(null);

  useEffect(() => {
    const { app, auth, db, storage } = initializeFirebase();
    setInstances({ app, auth, db, storage });
  }, []);

  if (!instances) return null;

  return (
    <FirebaseProvider app={instances.app} auth={instances.auth} db={instances.db} storage={instances.storage}>
      {children}
    </FirebaseProvider>
  );
}