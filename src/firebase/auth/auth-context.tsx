'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';

export type UserRole = 'student' | 'lecturer' | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  profileLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  profileLoading: true,
});

export function AuthStateProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const db = useFirestore();

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser && db) {
        setProfileLoading(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userRole = userDoc.data().role as UserRole;
            setRole(userRole);
            // Keep localStorage in sync as a fast-read cache
            if (typeof window !== 'undefined') {
              localStorage.setItem('nexlectra-role', userRole ?? '');
            }
          } else {
            setRole(null);
          }
        } catch {
          // Fallback to localStorage if Firestore read fails (e.g. offline)
          const cached = typeof window !== 'undefined'
            ? localStorage.getItem('nexlectra-role') as UserRole
            : null;
          setRole(cached);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setRole(null);
        setProfileLoading(false);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('nexlectra-role');
        }
      }
    });

    return unsubscribe;
  }, [auth, db]);

  return (
    <AuthContext.Provider value={{ user, role, loading, profileLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to access the current authenticated user and their role. */
export function useAuthState() {
  return useContext(AuthContext);
}
