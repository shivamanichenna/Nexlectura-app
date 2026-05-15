
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
  Trophy,
  Target,
  BarChart3,
  Brain,
  Loader2,
  FileText,
  AlertCircle,
  TrendingUp,
  Star,
  Users
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

  const gamificationStats = {
    xp: 2450,
    level: 12,
    nextLevelXp: 3000,
    rank: "Silver II",
    classPercentile: 85
  }

  const analyticsData = {
    consistency: 85,
    masteryBySubject: [
      { subject: "Economics", level: 92, trend: "+12%" },
      { subject: "DBMS", level: 64, trend: "+5%" },
      { subject: "Maths", level: 78, trend: "-2%" },
    ],
    frictionPoint: "Macro-Dynamics (Unit 2)",
    streak: 12
  }

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    if (hour >= 12 && hour < 17) setGreeting("Good afternoon")
    else if (hour >= 17) setGreeting("Good evening")
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-6 pb-24">
      {/* Header with XP & Level (Feature 15) */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-muted-foreground font-medium text-[10px] tracking-wide uppercase">{greeting}, {profile?.name?.split(' ')[0] || 'Student'} 👋</p>
          <h1 className="text-2xl font-headline font-bold text-secondary">Vani Learning Hub</h1>
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="flex items-center gap-2 bg-secondary text-white px-3 py-1.5 rounded-full shadow-lg">
              <Star className="h-3.5 w-3.5 text-primary fill-primary" />
              <span className="text-[10px] font-bold">LVL {gamificationStats.level}</span>
              <div className="h-3 w-12 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(gamificationStats.xp / gamificationStats.nextLevelXp) * 100}%` }} />
              </div>
           </div>
           <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
             <Flame className="h-3.5 w-3.5 text-primary fill-primary" />
             <span className="font-bold text-[10px] text-primary">{analyticsData.streak} Day Streak</span>
           </div>
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
          { icon: AlertCircle, label: "Exam Mode", color: "bg-destructive", path: "/exam-mode" },
        ].map((item, idx) => (
          <Link href={item.path} key={idx} className="flex flex-col items-center gap-2 group">
            <div className={`h-14 w-14 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-lg transition-all group-hover:scale-105 group-hover:-rotate-2`}>
              <item.icon className="h-6 w-6" />
            </div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight text-center leading-tight">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* AI Analytics & Performance Comparison (Feature 14 & 25) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Analytics & Growth
          </h3>
          <Badge className="bg-emerald-100 text-emerald-600 border-none font-bold text-[10px]">TOP {100 - gamificationStats.classPercentile}%</Badge>
        </div>
        
        <Card className="rounded-[2.5rem] border-none bg-secondary text-white shadow-2xl p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                 <svg className="h-20 w-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset={226 * (1 - analyticsData.consistency / 100)} className="text-primary transition-all duration-1000" />
                 </svg>
                 <div className="absolute flex flex-col items-center">
                    <span className="font-bold text-lg">{analyticsData.consistency}%</span>
                    <span className="text-[8px] uppercase font-bold text-white/40">Consistency</span>
                 </div>
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-base flex items-center gap-1.5">
                  Learning Mastery
                  <Trophy className="h-4 w-4 text-primary" />
                </h4>
                <p className="text-xs text-white/60 leading-relaxed">Better than <span className="text-primary font-bold">{gamificationStats.classPercentile}%</span> of <span className="text-white font-bold">{profile?.section || 'your class'}</span>. Your doubt resolution speed is improving!</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-white/10">
               <div className="flex justify-between items-center mb-1">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Subject Performance (vs Class Avg)</p>
                 <TrendingUp className="h-3 w-3 text-emerald-400" />
               </div>
               {analyticsData.masteryBySubject.map((item, i) => (
                 <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                       <span>{item.subject}</span>
                       <div className="flex gap-2">
                          <span className="text-primary">{item.level}%</span>
                          <span className={item.trend.startsWith('+') ? 'text-emerald-400 text-[10px]' : 'text-red-400 text-[10px]'}>{item.trend}</span>
                       </div>
                    </div>
                    <div className="relative h-1.5 w-full bg-white/10 rounded-full">
                      <div className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${item.level}%` }} />
                      <div className="absolute top-0 left-0 h-full w-[2px] bg-white/50" style={{ left: '72%' }} /> {/* Simulated Class Avg line */}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </Card>

        {/* AI Memory Reinforcement (Feature 20) */}
        <Card className="rounded-3xl border-none bg-blue-50 p-5 flex items-start gap-4 border border-blue-100">
           <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm shrink-0">
             <Target className="h-5 w-5" />
           </div>
           <div className="space-y-1 flex-1">
             <p className="font-bold text-sm text-secondary">Memory Reinforcement</p>
             <p className="text-[10px] text-muted-foreground leading-relaxed">
               It's been 3 days since you studied <span className="text-blue-600 font-bold">{analyticsData.frictionPoint}</span>. A quick 5-min recap will improve retention by 40%.
             </p>
             <Button variant="link" className="text-blue-600 font-bold p-0 h-auto text-[10px] flex items-center gap-1" asChild>
               <Link href="/revision">Start Recap <ChevronRight className="h-3 w-3" /></Link>
             </Button>
           </div>
        </Card>
      </section>

      {/* Exam Preparation Assistant (Feature 17) */}
      <section className="space-y-4">
        <h3 className="font-headline font-bold text-lg flex items-center gap-2 px-1">
          <Lightbulb className="h-5 w-5 text-primary" />
          Exam Preparation
        </h3>
        <Link href="/exam-mode">
          <Card className="rounded-[2.5rem] bg-accent text-accent-foreground border-none p-6 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
             <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1.5">
                   <h4 className="text-lg font-headline font-bold text-secondary">Ready for Mid-terms?</h4>
                   <p className="text-xs text-muted-foreground">Get predicted questions & unit roadmaps.</p>
                   <div className="flex gap-3 mt-3">
                      <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full text-[9px] font-bold">
                         <Target className="h-3 w-3 text-primary" /> 12 Topics Identified
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full text-[9px] font-bold">
                         <TrendingUp className="h-3 w-3 text-emerald-500" /> Improvement: +15%
                      </div>
                   </div>
                </div>
                <div className="h-14 w-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                   <Zap className="h-7 w-7 fill-current" />
                </div>
             </div>
          </Card>
        </Link>
      </section>

      {/* Subject Feed (Feature 19) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
           <h3 className="font-headline font-bold text-lg flex items-center gap-2">
             <BookOpen className="h-5 w-5 text-primary" />
             Recent Coursework
           </h3>
           <Link href="/study" className="text-xs font-bold text-primary">Browse All</Link>
        </div>
        <div className="grid gap-3">
           {lecturesLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
           ) : lectures?.slice(0, 3).map((lec: any) => (
             <Link href={`/study/${lec.id}`} key={lec.id}>
               <Card className="rounded-2xl border-none bg-white shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
                 <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                   <Play className="h-6 w-6 fill-current" />
                 </div>
                 <div className="flex-1">
                   <h4 className="font-bold text-sm text-secondary truncate">{lec.title}</h4>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase">{lec.subject} • {lec.semester} Sem</p>
                 </div>
                 <ChevronRight className="h-4 w-4 text-muted-foreground" />
               </Card>
             </Link>
           ))}
        </div>
      </section>
    </div>
  )
}
