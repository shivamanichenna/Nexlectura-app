
"use client"

import { useState, useEffect } from "react"
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
  Brain
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function StudentDashboard() {
  const [mounted, setMounted] = useState(false)
  const [greeting, setGreeting] = useState("Good morning")

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    if (hour >= 12 && hour < 17) setGreeting("Good afternoon")
    else if (hour >= 17) setGreeting("Good evening")
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-6 pb-20">
      {/* Dynamic Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-muted-foreground font-medium text-sm">{greeting}, Arjun 👋</h2>
          <h1 className="text-2xl font-headline font-bold text-secondary">Vani Learning Path</h1>
        </div>
        <Link href="/profile" className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 group">
          <Flame className="h-5 w-5 text-primary fill-primary animate-pulse" />
          <span className="font-bold text-primary">12</span>
        </Link>
      </div>

      {/* Daily Lecture Feed - Feature 3 */}
      <Card className="bg-secondary text-white border-none rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-secondary/20 group cursor-pointer">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:scale-125" />
        <CardContent className="p-7 relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
              <Zap className="h-4 w-4" />
              Today's Feed
            </div>
            <Badge variant="outline" className="border-white/20 text-white text-[10px]">Live Class</Badge>
          </div>
          <div>
            <h3 className="text-2xl font-headline font-bold">Intro to Macroeconomics</h3>
            <p className="text-white/60 text-sm mt-1">Prof. Murali • Chapter 4: Banking</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-medium">
              <span className="text-white/80">32 mins left • Next: "Money Multiplier"</span>
              <span className="text-white/80">45%</span>
            </div>
            <Progress value={45} className="h-2.5 bg-white/10" />
          </div>
          <Link href="/study/1">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl shadow-lg mt-2">
              <Play className="h-5 w-5 mr-2 fill-current" />
              Resume Classroom Session
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Access Grid */}
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
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* AI Recommendations - Feature 13 */}
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
                <p className="font-bold text-sm text-secondary">Review "CRR vs SLR" Flashcards</p>
                <p className="text-xs text-muted-foreground">You struggled with this in Unit 3.</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Card>
          </Link>
          
          <Link href="/study">
            <Card className="rounded-3xl border-none bg-blue-50/50 p-5 flex items-center gap-4 hover:bg-blue-50 transition-colors group">
              <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-105 transition-transform">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-secondary">New Summary: Unit 4 Statistics</p>
                <p className="text-xs text-muted-foreground">Uploaded by Prof. Rao 2h ago.</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Card>
          </Link>
        </div>
      </div>

      {/* Gamification/Progress - Feature 14/15 */}
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
