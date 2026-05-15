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
  Loader2,
  FileText,
  AlertCircle,
  Trophy
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useFirestore, useUser, useDoc, useCollection } from '@/firebase'
import { doc, collection, query, where, orderBy, limit } from 'firebase/firestore'

export default function StudentDashboard() {
  const [mounted, setMounted] = useState(false)
  const [greeting, setGreeting] = useState("Good morning")
  const { user } = useUser()
  const db = useFirestore()

  const studentRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, 'students', user.uid);
  }, [db, user]);

  const { data: profile, loading: profileLoading } = useDoc(studentRef);

  const sectionLecturesQuery = useMemo(() => {
    if (!db || !profile?.section) return null;
    return query(
      collection(db, 'lectures'),
      where('section', '==', profile.section)
    );
  }, [db, profile]);

  const { data: lectures, loading: lecturesLoading } = useCollection(sectionLecturesQuery);

  const latestLecture = useMemo(() => {
    if (!lectures || lectures.length === 0 || !profile) return null;
    return [...lectures]
      .filter(l => l.semester === profile.semester)
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))[0];
  }, [lectures, profile]);

  const todayLectures = [
    { time: "09:00 AM", title: "Data Structures", lecturer: "Prof. Rao", room: "Room 102", status: "Completed" },
    { time: "11:30 AM", title: "Operating Systems", lecturer: "Prof. S. Murali", room: "Room 402", status: "Upcoming" },
  ];

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    if (hour >= 12 && hour < 17) setGreeting("Good afternoon")
    else if (hour >= 17) setGreeting("Good evening")
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-muted-foreground font-medium text-xs tracking-wide uppercase">{greeting}, {profile?.name?.split(' ')[0] || 'Student'} 👋</p>
          <h1 className="text-2xl font-headline font-bold text-secondary">Vani Learning Hub</h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 group">
            <Flame className="h-4 w-4 text-primary fill-primary" />
            <span className="font-bold text-xs text-primary">12 Day Streak</span>
          </div>
          <Badge variant="secondary" className="text-[10px] font-bold uppercase">{profile?.section} • {profile?.semester} Sem</Badge>
        </div>
      </div>

      {/* Featured: Latest Classroom Session */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Latest Class Recording
          </h3>
          <Link href="/study" className="text-xs font-bold text-primary">View Library</Link>
        </div>
        {lecturesLoading || profileLoading ? (
          <Card className="rounded-[2rem] p-10 flex items-center justify-center bg-muted/20 border-none">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </Card>
        ) : latestLecture ? (
          <Card className="bg-secondary text-white border-none rounded-[2.5rem] overflow-hidden relative shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
            <CardContent className="p-6 relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-white/20 text-white text-[9px] uppercase tracking-widest font-bold">
                  {latestLecture.subject}
                </Badge>
                <div className="flex items-center gap-1.5 text-[10px] text-white/60">
                  <Clock className="h-3 w-3" />
                  Uploaded Recently
                </div>
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold leading-tight">{latestLecture.title}</h3>
                <p className="text-white/60 text-xs mt-1">{latestLecture.lecturerName}</p>
              </div>
              <Link href={`/study/${latestLecture.id}`}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-lg mt-2 group">
                  <Play className="h-4 w-4 mr-2 fill-current group-hover:scale-110 transition-transform" />
                  Enter Classroom Session
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-[2rem] bg-accent/30 border-dashed border-2 p-8 text-center space-y-3">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center mx-auto text-muted-foreground shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-muted-foreground">Waiting for teacher uploads...</p>
          </Card>
        )}
      </section>

      {/* Quick Navigation */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: MessageSquare, label: "AI Tutor", color: "bg-blue-500", path: "/chat" },
          { icon: Sparkles, label: "Revision", color: "bg-orange-500", path: "/revision" },
          { icon: Brain, label: "Quizzes", color: "bg-purple-500", path: "/tests" },
          { icon: FileText, label: "Notes", color: "bg-emerald-500", path: "/study" },
        ].map((item, idx) => (
          <Link href={item.path} key={idx} className="flex flex-col items-center gap-2 group">
            <div className={`h-14 w-14 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-lg transition-all group-hover:scale-105 group-hover:-rotate-2`}>
              <item.icon className="h-6 w-6" />
            </div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight text-center leading-tight">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Today's Schedule (Feature 3) */}
      <section className="space-y-3">
        <h3 className="font-headline font-bold text-lg flex items-center gap-2 px-1">
          <Calendar className="h-5 w-5 text-primary" />
          Today's Lectures
        </h3>
        <div className="space-y-3">
          {todayLectures.map((lec, idx) => (
            <Card key={idx} className="rounded-2xl border-none bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="text-center min-w-[60px] border-r pr-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">{lec.time.split(' ')[1]}</p>
                  <p className="text-sm font-bold text-secondary">{lec.time.split(' ')[0]}</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-secondary">{lec.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-medium">{lec.lecturer} • {lec.room}</p>
                </div>
                <Badge variant={lec.status === 'Completed' ? 'secondary' : 'outline'} className="text-[8px] h-4 font-bold">
                  {lec.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* AI Recommendations & Reminders (Feature 13, 17, 18) */}
      <section className="space-y-4">
        <h3 className="font-headline font-bold text-lg flex items-center gap-2 px-1">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI Study Recommendations
        </h3>
        <div className="grid gap-3">
          <Link href="/revision">
            <Card className="rounded-3xl border-none bg-accent p-4 flex items-center gap-4 hover:bg-accent/80 transition-colors group">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                <Brain className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-secondary">Refresh OS Concepts</p>
                <p className="text-[10px] text-muted-foreground">Vani identified 3 weak topics in Unit 2.</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Card>
          </Link>
          
          <Card className="rounded-3xl border-none bg-blue-50 p-4 flex items-center gap-4 border border-blue-100">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-secondary">Assignment Due</p>
              <p className="text-[10px] text-muted-foreground">DBMS Weekly Task is due in 2 days.</p>
            </div>
            <Button variant="link" size="sm" className="text-blue-500 font-bold text-[10px] h-auto p-0">Submit</Button>
          </Card>
        </div>
      </section>

      {/* Mastery & Performance (Feature 14, 25) */}
      <section>
        <Card className="rounded-[2.5rem] border-none bg-secondary text-white shadow-2xl p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
               <svg className="h-20 w-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset={226 * (1 - 0.72)} className="text-primary transition-all duration-1000" />
               </svg>
               <div className="absolute flex flex-col items-center">
                  <span className="font-bold text-lg">72%</span>
                  <span className="text-[8px] uppercase font-bold text-white/40">Goal</span>
               </div>
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-base flex items-center gap-1.5">
                Weekly Mastery
                <Trophy className="h-4 w-4 text-primary" />
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">You're in the top 15% of <span className="text-white font-bold">{profile?.section}</span> this week! Keep it up.</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-2">
                <ArrowUpRight className="h-3 w-3" />
                +12% progress from last week
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
