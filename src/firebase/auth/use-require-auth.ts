'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState, type UserRole } from './auth-context';

interface UseRequireAuthOptions {
  /**
   * Where to redirect if the user is not authenticated.
   * Defaults to '/login'.
   */
  redirectTo?: string;
  /**
   * If provided, the user must have this role.
   * If they don't match, they are redirected to `roleRedirectTo`.
   */
  requiredRole?: UserRole;
  /**
   * Where to redirect if the user doesn't have the required role.
   * Defaults to '/home'.
   */
  roleRedirectTo?: string;
}

/**
 * Protect a page: redirects unauthenticated users to /login,
 * and optionally enforces a role requirement.
 *
 * @example
 * // In a lecturer-only page
 * const { user, role } = useRequireAuth({ requiredRole: 'lecturer', roleRedirectTo: '/home' });
 */
export function useRequireAuth({
  redirectTo = '/login',
  requiredRole,
  roleRedirectTo = '/home',
}: UseRequireAuthOptions = {}) {
  const { user, role, loading, profileLoading } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // wait for auth to resolve

    if (!user) {
      router.replace(redirectTo);
      return;
    }

    if (requiredRole && !profileLoading && role !== requiredRole) {
      router.replace(roleRedirectTo);
    }
  }, [user, role, loading, profileLoading, router, redirectTo, requiredRole, roleRedirectTo]);

  return { user, role, loading: loading || profileLoading };
}
