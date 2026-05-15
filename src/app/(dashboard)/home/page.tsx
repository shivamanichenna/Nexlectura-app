
"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Sparkles, 
  Zap, 
  Flame, 
  Clock, 
  Play, 
  BookOpen, 
  MessageSquare,
  Calendar,
  ChevronRight,
  Lightbulb,
  ArrowUpRight,
  TrendingUp,
  Brain,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useFirestore, useUser, useDoc, useCollection } from '@/firebase'
import { doc, collection, query, where } from 'firebase/firestore'

export default function StudentDashboard() {
  const [mounted, setMounted] = useState(false)
  const [greeting, setGreeting] = useState("Good morning")
  const { user } = useUser()
  const db = useFirestore()

  // 1. Fetch Student Profile to know their Semester/Section
  const studentRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, 'students', user.uid);
  }, [db, user]);

  const { data: profile, loading: profileLoading } = useDoc(studentRef);

  // 2. Fetch lectures for their section (simplified query to avoid index requirement)
  const sectionLecturesQuery = useMemo(() => {
    if (!db || !profile?.section) return null;
    return query(
      collection(db, 'lectures'),
      where('section', '==', profile.section)
    );
  }, [db, profile]);

  const { data: lectures, loading: lecturesLoading } = useCollection(sectionLecturesQuery);

  // 3. Filter for semester and sort by date in memory
  const latestLecture = useMemo(() => {
    if (!lectures || lectures.length === 0 || !profile) return null;
    
    return [...lectures]
      .filter(l => l.semester === profile.semester)
      .sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      })[0];
  }, [lectures, profile]);

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    if (hour >= 12 && hour < 17) setGreeting("Good afternoon")
    else if (hour >= 17) setGreeting("Good evening")
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-muted-foreground font-medium text-sm">{greeting}, {profile?.name || 'Student'} 👋</h2>
          <h1 className="text-2xl font-headline font-bold text-secondary">Vani Learning Path</h1>
        </div>
        <Link href="/profile" className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 group">
          <Flame className="h-5 w-5 text-primary fill-primary animate-pulse" />
          <span className="font-bold text-primary">12</span>
        </Link>
      </div>

      {lecturesLoading || profileLoading ? (
        <Card className="rounded-[2.5rem] p-12 flex items-center justify-center bg-muted/20 border-none">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </Card>
      ) : latestLecture ? (
        <Card className="bg-secondary text-white border-none rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-secondary/20 group cursor-pointer">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:scale-125" />
          <CardContent className="p-7 relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                <Zap className="h-4 w-4" />
                Latest From Class
              </div>
              <Badge variant="outline" className="border-white/20 text-white text-[10px]">
                {latestLecture.status === 'processing' ? 'Processing' : 'Ready'}
              </Badge>
            </div>
            <div>
              <h3 className="text-2xl font-headline font-bold">{latestLecture.title}</h3>
              <p className="text-white/60 text-sm mt-1">{latestLecture.lecturerName} • {latestLecture.subject}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-white/80">Continue where you left off</span>
                <span className="text-white/80">0%</span>
              </div>
              <Progress value={5} className="h-2.5 bg-white/10" />
            </div>
            <Link href={`/study/${latestLecture.id}`}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl shadow-lg mt-2">
                <Play className="h-5 w-5 mr-2 fill-current" />
                Enter Classroom Session
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-[2.5rem] bg-accent/30 border-dashed border-2 p-8 text-center space-y-3">
          <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mx-auto text-muted-foreground shadow-sm">
            <BookOpen className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">No lectures found for your section ({profile?.section || 'N/A'}).</p>
          <p className="text-[10px] text-muted-foreground/60 uppercase font-bold">Waiting for teacher to upload</p>
        </Card>
      )}

      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: MessageSquare, label: "AI Tutor", color: "bg-blue-500", path: "/chat" },
          { icon: Sparkles, label: "Revision", color: "bg-orange-500", path: "/revision" },
          { icon: BookOpen, label: "Library", color: "bg-purple-500", path: "/study" },
          { icon: Brain, label: "Tests", color: "bg-emerald-500", path: "/tests" },
        ].map((item, idx) => (
          <Link href={item.path} key={idx} className="flex flex-col items-center gap-2 group">
            <div className={`h-14 w-14 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-xl transition-all group-hover:scale-110 group-hover:-rotate-3`}>
              <item.icon className="h-6 w-6" />
            </div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter text-center leading-tight">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-headline font-bold text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI Study Suggestions
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <Link href="/revision">
            <Card className="rounded-3xl border-none bg-accent/50 p-5 flex items-center gap-4 hover:bg-accent transition-colors group">
              <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-secondary">Refresh Flashcards</p>
                <p className="text-xs text-muted-foreground">Review topics from your last session.</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Card>
          </Link>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-none bg-secondary text-white shadow-xl p-6">
        <div className="flex items-center gap-6">
          <div className="relative h-20 w-20 flex items-center justify-center">
             <svg className="h-20 w-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset={226 * (1 - 0.72)} className="text-primary" />
             </svg>
             <span className="absolute font-bold text-xl">72%</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg flex items-center gap-1.5">
              Growth Mastery
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </h4>
            <p className="text-sm text-white/60">You're in the top 15% of your section this week!</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
