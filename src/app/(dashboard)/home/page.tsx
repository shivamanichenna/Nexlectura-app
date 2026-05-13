"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Zap, Flame, Clock, Play, TrendingDown, BookOpen, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function StudentDashboard() {
  const [greeting, setGreeting] = useState("Good morning")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 12 && hour < 17) setGreeting("Good afternoon")
    else if (hour >= 17) setGreeting("Good evening")
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-muted-foreground font-medium">{greeting}, Arjun 👋</h2>
          <h1 className="text-2xl font-headline font-bold text-secondary">Ready to learn?</h1>
        </div>
        <div className="bg-primary/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Flame className="h-5 w-5 text-primary fill-primary" />
          <span className="font-bold text-primary">12</span>
        </div>
      </div>

      {/* Hero: Continue Learning */}
      <Card className="bg-secondary text-white border-none rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
        <CardContent className="p-6 relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Zap className="h-4 w-4" />
            Active Lecture
          </div>
          <h3 className="text-xl font-headline font-bold">Introduction to Macroeconomics</h3>
          <p className="text-white/60 text-sm">Chapter 4: Banking and Credit Control</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/80">32 mins remaining</span>
              <span className="text-white/80">45%</span>
            </div>
            <Progress value={45} className="h-2 bg-white/20" />
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl">
            <Play className="h-4 w-4 mr-2 fill-current" />
            Resume Lecture
          </Button>
        </CardContent>
      </Card>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: MessageSquare, label: "Tutor", color: "bg-blue-500", path: "/chat" },
          { icon: Sparkles, label: "Revision", color: "bg-orange-500", path: "/revision" },
          { icon: BookOpen, label: "Notes", color: "bg-purple-500", path: "/study" },
          { icon: Clock, label: "History", color: "bg-emerald-500", path: "/profile" },
        ].map((item, idx) => (
          <Link href={item.path} key={idx} className="flex flex-col items-center gap-2 group">
            <div className={`h-14 w-14 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
              <item.icon className="h-6 w-6" />
            </div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* AI Insights: Weak Topics */}
      <div className="space-y-3">
        <h3 className="font-headline font-bold text-lg flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-destructive" />
          Weak Topics Detected
        </h3>
        <div className="space-y-3">
          {[
            { topic: "Quantum Mechanics: Heisenberg's Principle", score: 42, color: "text-destructive" },
            { topic: "Organic Chemistry: Esterification", score: 58, color: "text-orange-500" },
          ].map((item, idx) => (
            <Card key={idx} className="rounded-2xl border-2 border-muted hover:border-primary/20 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{item.topic}</p>
                  <p className="text-xs text-muted-foreground">Mastery: <span className={item.color}>{item.score}%</span></p>
                </div>
                <Button size="sm" variant="outline" className="rounded-lg h-8 text-xs font-bold border-primary text-primary hover:bg-primary/5">
                  Revise Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <Card className="rounded-3xl border-none bg-accent/30 shadow-none">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
             <div className="absolute inset-0 border-t-4 border-primary rounded-full rotate-45" />
             <span className="font-bold text-primary">72%</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-secondary">Weekly Mastery Goal</h4>
            <p className="text-sm text-muted-foreground">You are 3 lectures away from your target.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
