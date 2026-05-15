
'use client';

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Users, 
  TrendingUp, 
  Play, 
  Settings,
  Sparkles,
  Loader2,
  Database,
  BarChart3,
  Clock,
  BookOpen,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Zap
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useFirestore, useUser, useCollection, useDoc } from '@/firebase'
import { collection, query, where, addDoc, serverTimestamp, doc } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"

export default function LecturerDashboard() {
  const router = useRouter()
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()
  const [isSeeding, setIsSeeding] = useState(false)

  // Fetch Lecturer Profile
  const lecturerRef = useMemo(() => (db && user ? doc(db, 'lecturers', user.uid) : null), [db, user]);
  const { data: profile } = useDoc(lecturerRef);

  // Simplified query: No orderBy to avoid composite index requirement
  const lecturesQuery = useMemo(() => {
    if (!db || !user) return null
    return query(
      collection(db, 'lectures'),
      where('lecturerId', '==', user.uid)
    )
  }, [db, user])

  const { data: rawLectures, loading } = useCollection(lecturesQuery)

  // Sort in memory instead of in the query
  const lectures = useMemo(() => {
    if (!rawLectures) return []
    return [...rawLectures].sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0
      const timeB = b.createdAt?.seconds || 0
      return timeB - timeA
    })
  }, [rawLectures])

  const seedDemoData = async () => {
    if (!db || !user) return
    setIsSeeding(true)
    
    const demoLectures = [
      {
        title: "Introduction to Macroeconomics",
        subject: "Economics",
        semester: "4th",
        section: "CSE-A",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        transcript: "Welcome to Macroeconomics. Today we study the Gross Domestic Product and its impact on national wealth. GDP measures the value of all finished goods produced within a country's borders in a specific time period.",
        lecturerId: user.uid,
        lecturerName: profile?.name || "Prof. Murali",
        status: 'completed',
        createdAt: serverTimestamp()
      },
      {
        title: "The Indian Banking System",
        subject: "Economics",
        semester: "4th",
        section: "CSE-A",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        transcript: "The banking system in India consists of the central bank, which is the RBI, commercial banks, and cooperative banks. We will look at CRR and SLR requirements today.",
        lecturerId: user.uid,
        lecturerName: profile?.name || "Prof. Murali",
        status: 'completed',
        createdAt: serverTimestamp()
      }
    ]

    try {
      for (const lecture of demoLectures) {
        await addDoc(collection(db, 'lectures'), lecture)
      }
      toast({
        title: "Demo data seeded!",
        description: "Your dashboard is now populated with sample lectures.",
      })
    } catch (e) {
      console.error(e)
      toast({
        variant: "destructive",
        title: "Seed failed",
        description: "Check your database connection or rules.",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header (Feature 1 & 2) */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-muted-foreground font-medium text-[10px] tracking-wide uppercase">Lecturer Portal • {profile?.department || 'Faculty'}</p>
          <h1 className="text-2xl font-headline font-bold text-secondary">
            {profile?.name ? `Prof. ${profile.name}` : 'Welcome back!'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="rounded-xl border-primary text-primary font-bold gap-2 h-9"
            onClick={seedDemoData}
            disabled={isSeeding}
          >
            {isSeeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
            <span className="hidden sm:inline">Seed Demo</span>
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full bg-muted/50 h-9 w-9"
            onClick={() => router.push('/profile')}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Engagement Stats (Feature 2 & 11) */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-2xl border-none bg-primary text-white p-4 space-y-3 shadow-lg shadow-primary/20">
          <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
            <Users className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-bold">842</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/70">Enrolled Students</p>
          </div>
        </Card>
        <Card className="rounded-2xl border-none bg-secondary text-white p-4 space-y-3 shadow-lg shadow-secondary/20">
          <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-bold">88%</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/70">Avg. Engagement</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions Grid (Feature 3 & 4) */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Upload, label: "Upload", path: "/lecturer/upload", color: "bg-blue-500" },
          { icon: BookOpen, label: "Classes", path: "/lecturer/classes", color: "bg-orange-500" },
          { icon: Sparkles, label: "AI Assistant", path: "/lecturer/ai-assistant", color: "bg-purple-500" },
        ].map((action, idx) => (
          <Link href={action.path} key={idx} className="flex flex-col items-center gap-2 group">
            <div className={`h-14 w-14 rounded-2xl ${action.color} flex items-center justify-center text-white shadow-lg transition-all group-hover:scale-105 group-hover:-rotate-2`}>
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight text-center leading-tight">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* AI Classroom Insights Summary (Feature 13) */}
      <Card className="rounded-[2.5rem] bg-secondary text-white border-none p-6 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Vani AI Insights</h3>
          </div>
          <Badge className="bg-primary/20 text-primary border-none text-[8px] font-bold uppercase">New Analytics</Badge>
        </div>
        <div className="space-y-3 relative z-10">
          <div className="flex gap-3">
             <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 shrink-0 animate-pulse" />
             <p className="text-[11px] text-white/70 leading-relaxed">
               <span className="font-bold text-white">Confusion Spike:</span> 12 students struggled with "Money Multiplier" concepts in your last session.
             </p>
          </div>
          <div className="flex gap-3">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
             <p className="text-[11px] text-white/70 leading-relaxed">
               <span className="font-bold text-white">Engagement:</span> Quiz scores in <span className="text-emerald-400 font-bold">EC-B</span> improved by 15% after your analogy update.
             </p>
          </div>
        </div>
        <Button variant="link" className="text-primary font-bold p-0 h-auto text-[10px] w-full justify-start relative z-10" asChild>
          <Link href="/lecturer/insights">View Deep Analytics <ArrowRight className="h-3 w-3 ml-1" /></Link>
        </Button>
      </Card>

      {/* Recent Activity Feed (Feature 2) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Classroom Overview
          </h3>
          <Link href="/lecturer/classes" className="text-xs font-bold text-primary">View All</Link>
        </div>

        <div className="grid gap-3">
          {/* Pending Tasks (Feature 9) */}
          <Card className="rounded-2xl border-2 border-muted hover:border-primary/10 transition-all bg-white p-4 group">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-secondary">Grading: Unit 2 Quiz</h4>
                <p className="text-[10px] text-muted-foreground font-bold uppercase">42 Submissions Pending • CSE-A</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          {/* Recent Lectures (Feature 2 & 20) */}
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : lectures && lectures.length > 0 ? (
            lectures.slice(0, 3).map((lecture: any) => (
              <Link href={`/study/${lecture.id}`} key={lecture.id}>
                <Card className="rounded-2xl border-none bg-white shadow-sm border-2 border-muted hover:border-primary/20 transition-all">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <Play className="h-5 w-5 fill-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-secondary truncate">{lecture.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-[8px] h-4 py-0 uppercase font-bold">{lecture.subject}</Badge>
                        <span className="text-[9px] text-muted-foreground font-bold">{lecture.section} • {lecture.semester} Sem</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <Card className="rounded-2xl border-2 border-dashed border-muted p-8 text-center bg-muted/5">
              <p className="text-xs font-medium text-muted-foreground">Start by uploading your first live lecture.</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
