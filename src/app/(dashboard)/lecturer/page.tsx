
'use client';

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Plus, 
  Play, 
  Clock,
  Calendar,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Settings,
  Sparkles,
  Loader2,
  FileAudio
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useFirestore, useUser, useCollection } from '@/firebase'
import { collection, query, where, orderBy } from 'firebase/firestore'

export default function LecturerDashboard() {
  const router = useRouter()
  const db = useFirestore()
  const { user } = useUser()

  // Memoize the query to fetch lectures for the current lecturer
  const lecturesQuery = useMemo(() => {
    if (!db || !user) return null
    return query(
      collection(db, 'lectures'),
      where('lecturerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
  }, [db, user])

  const { data: lectures, loading } = useCollection(lecturesQuery)

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-muted-foreground font-medium text-sm">Welcome back,</h2>
          <h1 className="text-2xl font-headline font-bold text-secondary">Prof. S. Murali Krishna</h1>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="rounded-full bg-muted/50"
          onClick={() => router.push('/profile')}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Quick Stats Banner */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        <Card className="min-w-[140px] rounded-2xl border-none bg-primary/10 text-primary p-4 space-y-2">
          <Users className="h-5 w-5" />
          <div>
            <p className="text-xl font-bold">842</p>
            <p className="text-[9px] font-bold uppercase">Students</p>
          </div>
        </Card>
        <Card className="min-w-[140px] rounded-2xl border-none bg-blue-500/10 text-blue-600 p-4 space-y-2">
          <MessageCircle className="h-5 w-5" />
          <div>
            <p className="text-xl font-bold">14</p>
            <p className="text-[9px] font-bold uppercase">Open Doubts</p>
          </div>
        </Card>
        <Card className="min-w-[140px] rounded-2xl border-none bg-purple-500/10 text-purple-600 p-4 space-y-2">
          <TrendingUp className="h-5 w-5" />
          <div>
            <p className="text-xl font-bold">88%</p>
            <p className="text-[9px] font-bold uppercase">Engagement</p>
          </div>
        </Card>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/lecturer/upload" className="block">
          <Card className="h-full rounded-3xl bg-secondary text-white border-none p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center mb-4">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Upload Lecture</h3>
              <p className="text-white/50 text-[10px]">AI auto-processing</p>
            </div>
          </Card>
        </Link>
        <Link href="/lecturer/assignments" className="block">
          <Card className="h-full rounded-3xl border-2 border-muted bg-white p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="h-10 w-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-secondary">Assignments</h3>
              <p className="text-muted-foreground text-[10px]">Create & Review</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Uploads */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <FileAudio className="h-5 w-5 text-primary" />
            My Uploaded Lectures
          </h3>
          <Link href="/lecturer/upload" className="text-xs font-bold text-primary flex items-center">
            View All <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : lectures && lectures.length > 0 ? (
          <div className="grid gap-3">
            {lectures.map((lecture: any) => (
              <Card key={lecture.id} className="rounded-2xl border-2 border-muted overflow-hidden hover:border-primary/20 transition-all group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Play className="h-6 w-6 fill-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-secondary truncate">{lecture.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[9px] h-4 py-0 uppercase font-bold">{lecture.subject}</Badge>
                      <span className="text-[10px] text-muted-foreground font-bold">{lecture.semester} • {lecture.section}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={lecture.status === 'completed' ? 'default' : 'secondary'} className="text-[8px] h-4 uppercase mb-1">
                      {lecture.status}
                    </Badge>
                    <p className="text-[9px] font-bold text-muted-foreground">
                      {lecture.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="rounded-2xl border-2 border-dashed border-muted p-8 text-center bg-muted/5">
            <p className="text-sm font-medium text-muted-foreground">No lectures uploaded yet.</p>
            <Link href="/lecturer/upload">
              <Button variant="link" className="text-primary font-bold mt-2">Upload your first lecture</Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Today's Schedule */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Schedule
          </h3>
          <Badge variant="outline" className="rounded-lg text-primary border-primary">Live</Badge>
        </div>
        <Card className="rounded-3xl border-2 border-muted overflow-hidden">
          <CardContent className="p-0">
            {[
              { time: "10:00 AM", title: "Macroeconomics (Sec A)", room: "Room 402", status: "Completed" },
              { time: "11:30 AM", title: "Indian Banking System", room: "Lecture Hall 1", status: "Ongoing" },
              { time: "02:00 PM", title: "Seminar: Fiscal Policy", room: "Virtual", status: "Upcoming" },
            ].map((session, idx) => (
              <div key={idx} className={`p-4 flex items-center gap-4 ${idx !== 2 ? 'border-b border-muted' : ''} ${session.status === 'Ongoing' ? 'bg-primary/5' : ''}`}>
                <div className="text-center min-w-[70px]">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">{session.time.split(' ')[1]}</p>
                  <p className="text-sm font-bold text-secondary">{session.time.split(' ')[0]}</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-secondary">{session.title}</h4>
                  <p className="text-xs text-muted-foreground">{session.room}</p>
                </div>
                <div className={`text-[10px] font-bold uppercase ${session.status === 'Completed' ? 'text-green-500' : session.status === 'Ongoing' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {session.status}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Classroom Insights Summary */}
      <Card className="rounded-3xl bg-accent/50 border border-accent p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-secondary">AI Classroom Insights</h3>
        </div>
        <div className="space-y-3">
          <div className="flex gap-3">
             <div className="h-2 w-2 rounded-full bg-destructive mt-1.5 shrink-0" />
             <p className="text-xs text-muted-foreground leading-relaxed">
               <span className="font-bold text-secondary">Confusion Spike:</span> 12 students struggled with "Money Multiplier" in yesterday's lecture.
             </p>
          </div>
          <div className="flex gap-3">
             <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
             <p className="text-xs text-muted-foreground leading-relaxed">
               <span className="font-bold text-secondary">Improvement:</span> Top 10% students increased their quiz scores by 15% after using AI Flashcards.
             </p>
          </div>
        </div>
        <Link href="/lecturer/insights">
          <Button variant="outline" className="w-full h-10 rounded-xl text-xs font-bold border-primary text-primary hover:bg-primary/5">
            View Detailed Analytics
            <ArrowRight className="h-3 w-3 ml-2" />
          </Button>
        </Link>
      </Card>
    </div>
  )
}
