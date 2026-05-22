'use client';

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, HelpCircle, EyeOff, Eye, Loader2, AlertCircle } from "lucide-react"
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { errorEmitter } from '@/firebase/error-emitter'
import { FirestorePermissionError } from '@/firebase/errors'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const auth = useAuth()
  const db = useFirestore()

  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<'student' | 'lecturer'>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [configError, setConfigError] = useState<string | null>(null)

  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam === 'lecturer') {
      setRole('lecturer')
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth || !db) return

    setIsLoading(true)
    setConfigError(null)
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef).catch(err => {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'get',
          originalError: err
        });
        errorEmitter.emit('permission-error', permissionError);
        throw err;
      });
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        if (typeof window !== 'undefined') {
          localStorage.setItem('nexlectra-role', userRole);
        }

        toast({
          title: "Welcome back!",
          description: "Login successful.",
        });

        router.push(userRole === 'lecturer' ? '/lecturer' : '/home');
      } else {
        toast({
          variant: "destructive",
          title: "Profile Missing",
          description: "No profile found. Please sign up first.",
        });
      }
    } catch (error: any) {
      const authError = error as AuthError;
      if (authError.code === 'auth/configuration-not-found') {
        setConfigError("Authentication is not yet configured. Please enable 'Email/Password' in your Firebase Console.");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password. If you haven't created an account, use the Signup button below.",
        });
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemo = () => {
    setEmail(role === 'lecturer' ? 'lecturer@nexlectra.com' : 'student@nexlectra.com')
    setPassword('password123')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top App Bar */}
      <div className="flex items-center justify-between p-4 px-6">
        <button onClick={() => router.back()} className="text-foreground hover:opacity-70 transition-opacity">
          <ArrowLeft className="h-6 w-6 text-primary" />
        </button>
        <span className="font-headline font-bold text-lg text-primary">Nexlectra</span>
        <button className="text-foreground hover:opacity-70 transition-opacity">
          <HelpCircle className="h-6 w-6 text-primary" />
        </button>
      </div>

      <div className="flex-1 flex flex-col pt-8 px-6 max-w-md mx-auto w-full">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-headline font-extrabold text-foreground tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm">
            Log in to continue learning.
          </p>
        </div>

        {configError && (
          <Alert variant="destructive" className="mb-6 rounded-2xl border-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Setup Required</AlertTitle>
            <AlertDescription className="text-xs">
              {configError}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 mb-8">
          <Button variant="outline" className="w-full h-14 text-sm font-semibold text-foreground flex items-center justify-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="currentColor"/>
            </svg>
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full h-14 text-sm font-semibold text-foreground flex items-center justify-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"/>
            </svg>
            Continue with Apple
          </Button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-4 text-muted-foreground font-semibold">OR</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-foreground">Email</Label>
              <Input 
                id="email" 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="h-14 bg-card" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pass" className="text-xs font-bold text-foreground">Password</Label>
                <button type="button" onClick={fillDemo} className="text-xs text-primary font-semibold">Forgot?</button>
              </div>
              <div className="relative">
                <Input 
                  id="pass" 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="h-14 bg-card pr-12" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" disabled={isLoading} className="w-full h-14 text-base mt-2">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Sign In"}
          </Button>
        </form>
      </div>

      <div className="mt-auto text-center pb-8 pt-6">
        <p className="text-muted-foreground text-sm">
          Don't have an account? <button onClick={() => router.push('/signup')} className="text-primary font-bold">Sign Up</button>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
