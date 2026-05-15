
'use client';

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Mail, Lock, Fingerprint, GraduationCap, User, Loader2 } from "lucide-react"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { useToast } from "@/hooks/use-toast"

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
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        if (typeof window !== 'undefined') {
          localStorage.setItem('vani-role', userRole);
        }

        toast({
          title: "Welcome back!",
          description: "Login successful.",
        });

        if (userRole === 'lecturer') {
          router.push('/lecturer');
        } else {
          router.push('/home');
        }
      } else {
        throw new Error("User record not found. Please sign up.");
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid email or password.",
      });
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
            {role === 'lecturer' ? "Manage your AI classroom and students." : "Your AI classroom is waiting for you."}
          </p>
        </div>

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
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="pass" className="text-sm font-semibold">Password</Label>
                <button type="button" className="text-sm text-primary font-bold">Forgot?</button>
              </div>
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

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-4 text-muted-foreground font-medium">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-14 rounded-2xl border-2 hover:bg-muted transition-colors">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </Button>
          <Button variant="outline" className="h-14 rounded-2xl border-2 hover:bg-muted transition-colors">
            <Fingerprint className="h-5 w-5 mr-2" />
            Bio ID
          </Button>
        </div>
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
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
