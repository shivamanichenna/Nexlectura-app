
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
  Play, 
  Calendar,
  CheckCircle2,
  ArrowRight,
  Settings,
  Sparkles,
  Loader2,
  FileAudio,
  Database
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useFirestore, useUser, useCollection } from '@/firebase'
import { collection, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"

export default function LecturerDashboard() {
  const router = useRouter()
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()
  const [isSeeding, setIsSeeding] = useState(false)

  const lecturesQuery = useMemo(() => {
    if (!db || !user) return null
    return query(
      collection(db, 'lectures'),
      where('lecturerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
  }, [db, user])

  const { data: lectures, loading } = useCollection(lecturesQuery)

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
        lecturerName: "Prof. S. Murali Krishna",
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
        lecturerName: "Prof. S. Murali Krishna",
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
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-muted-foreground font-medium text-sm">Welcome back,</h2>
          <h1 className="text-2xl font-headline font-bold text-secondary">Prof. S. Murali Krishna</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="rounded-xl border-primary text-primary font-bold gap-2"
            onClick={seedDemoData}
            disabled={isSeeding}
          >
            {isSeeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
            Seed Demo
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full bg-muted/50"
            onClick={() => router.push('/profile')}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
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
              <Link href={`/study/${lecture.id}`} key={lecture.id}>
                <Card className="rounded-2xl border-2 border-muted overflow-hidden hover:border-primary/20 transition-all group">
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
              </Link>
            ))}
          </div>
        ) : (
          <Card className="rounded-2xl border-2 border-dashed border-muted p-8 text-center bg-muted/5">
            <p className="text-sm font-medium text-muted-foreground">No lectures uploaded yet.</p>
            <Button variant="link" onClick={seedDemoData} className="text-primary font-bold mt-2">Seed demo lectures</Button>
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
