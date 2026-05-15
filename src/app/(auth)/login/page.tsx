'use client';

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Mail, Lock, GraduationCap, User, Loader2, AlertCircle } from "lucide-react"
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

      // Fetch user role from Firestore to ensure valid profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        // Persist role for layout handling
        if (typeof window !== 'undefined') {
          localStorage.setItem('vani-role', userRole);
        }

        toast({
          title: "Welcome back!",
          description: "Login successful.",
        });

        // Redirect based on actual stored role
        if (userRole === 'lecturer') {
          router.push('/lecturer');
        } else {
          router.push('/home');
        }
      } else {
        toast({
          variant: "destructive",
          title: "Profile Missing",
          description: "No profile found for this user. Please sign up first.",
        });
      }
    } catch (error: any) {
      const authError = error as AuthError;
      
      if (authError.code === 'auth/configuration-not-found') {
        setConfigError("Authentication is not yet configured. Please enable 'Email/Password' in your Firebase Console.");
      } else if (authError.code === 'auth/invalid-credential') {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: authError.message || "An unexpected error occurred.",
        });
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 max-w-md mx-auto">
      <div className="flex-1 flex flex-col pt-12">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-4">
            {role === 'lecturer' ? <GraduationCap className="h-8 w-8" /> : <Sparkles className="h-8 w-8" />}
          </div>
          <h1 className="text-3xl font-headline font-bold text-secondary">
            {role === 'lecturer' ? "Lecturer Portal" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {role === 'lecturer' ? "Manage your AI classroom." : "Your AI classroom is waiting."}
          </p>
        </div>

        {configError && (
          <Alert variant="destructive" className="mb-6 rounded-2xl border-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuration Required</AlertTitle>
            <AlertDescription className="text-xs">
              {configError}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex bg-muted/50 p-1 rounded-xl mb-8">
          <button 
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${role === 'student' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
          >
            <User className="h-4 w-4" /> Student
          </button>
          <button 
            type="button"
            onClick={() => setRole('lecturer')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${role === 'lecturer' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
          >
            <GraduationCap className="h-4 w-4" /> Lecturer
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold ml-1">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu" 
                  className="h-14 pl-12 rounded-2xl bg-white border-2 focus:border-primary transition-all text-lg" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass" className="text-sm font-semibold ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="pass" 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="h-14 pl-12 rounded-2xl bg-white border-2 focus:border-primary transition-all text-lg" 
                />
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" disabled={isLoading} className="w-full h-14 rounded-2xl text-lg font-semibold shadow-xl shadow-primary/20">
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              `Login as ${role === 'lecturer' ? 'Lecturer' : 'Student'}`
            )}
          </Button>
        </form>
      </div>

      <div className="mt-8 text-center pb-6">
        <p className="text-muted-foreground">
          New here? <button onClick={() => router.push('/signup')} className="text-primary font-bold">Create Account</button>
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
