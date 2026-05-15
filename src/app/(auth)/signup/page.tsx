'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  GraduationCap, 
  User, 
  ArrowRight, 
  Loader2,
  Mail,
  Lock,
  Building,
  BookOpen,
  Hash
} from 'lucide-react';
import { createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'student' | 'lecturer'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [subjects, setSubjects] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 1. Create Core User Document
      const userData = {
        uid: user.uid,
        email: email,
        role: role
      };
      
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, userData)
        .catch(async (err) => {
          const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: userData
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
        });

      // 2. Create Role-Specific Profile Document
      if (role === 'lecturer') {
        const profileData = {
          name,
          department,
          subjects: subjects.split(',').map(s => s.trim()),
          college,
          lecturerId: user.uid
        };
        const lecturerRef = doc(db, 'lecturers', user.uid);
        setDoc(lecturerRef, profileData)
          .catch(async (err) => {
            const permissionError = new FirestorePermissionError({
              path: lecturerRef.path,
              operation: 'create',
              requestResourceData: profileData
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
          });
      } else {
        const profileData = {
          name,
          department,
          semester,
          section,
          college,
          studentId: user.uid
        };
        const studentRef = doc(db, 'students', user.uid);
        setDoc(studentRef, profileData)
          .catch(async (err) => {
            const permissionError = new FirestorePermissionError({
              path: studentRef.path,
              operation: 'create',
              requestResourceData: profileData
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
          });
      }

      toast({
        title: "Account created!",
        description: `Welcome to Vani AI, ${name}!`,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('vani-role', role);
      }

      // Small delay to allow optimistic Firestore updates to propagate locally
      setTimeout(() => {
        router.push(role === 'lecturer' ? '/lecturer' : '/home');
      }, 500);

    } catch (error: any) {
      const authError = error as AuthError;
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: authError.message || "An error occurred during registration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 max-w-md mx-auto">
      <div className="flex-1 flex flex-col pt-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-secondary">Join Vani AI</h1>
          <p className="text-muted-foreground mt-2">Start your AI-powered learning journey.</p>
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

        <form onSubmit={handleSignup} className="space-y-6 pb-12">
          <Card className="rounded-[2rem] border-2 border-muted overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold ml-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arjun Kothari" 
                    className="h-12 pl-12 rounded-xl bg-muted/30 border-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold ml-1">College Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    required 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu" 
                    className="h-12 pl-12 rounded-xl bg-muted/30 border-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold ml-1">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    required 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="h-12 pl-12 rounded-xl bg-muted/30 border-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold ml-1">College / University</Label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    required 
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Vani University" 
                    className="h-12 pl-12 rounded-xl bg-muted/30 border-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold ml-1">Department</Label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    required 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science" 
                    className="h-12 pl-12 rounded-xl bg-muted/30 border-none" 
                  />
                </div>
              </div>

              {role === 'student' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold ml-1">Semester</Label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        required 
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        placeholder="4th" 
                        className="h-12 pl-12 rounded-xl bg-muted/30 border-none" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold ml-1">Section</Label>
                    <div className="relative">
                      <ArrowRight className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        required 
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder="CSE-A" 
                        className="h-12 pl-12 rounded-xl bg-muted/30 border-none" 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold ml-1">Subjects (Comma separated)</Label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      required 
                      value={subjects}
                      onChange={(e) => setSubjects(e.target.value)}
                      placeholder="Economics, OS, DBMS" 
                      className="h-12 pl-12 rounded-xl bg-muted/30 border-none" 
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            size="lg" 
            disabled={isLoading} 
            className="w-full h-14 rounded-2xl text-lg font-semibold shadow-xl shadow-primary/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Creating Account...
              </>
            ) : (
              `Sign up as ${role === 'lecturer' ? 'Lecturer' : 'Student'}`
            )}
          </Button>
        </form>

        <div className="text-center pb-12">
          <p className="text-muted-foreground">
            Already have an account? <button onClick={() => router.push('/login')} className="text-primary font-bold">Login</button>
          </p>
        </div>
      </div>
    </div>
  );
}
