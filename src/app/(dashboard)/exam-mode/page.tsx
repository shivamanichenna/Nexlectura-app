
'use client';

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  Brain, 
  Target, 
  CheckCircle2, 
  ChevronLeft,
  Zap,
  Flame,
  AlertTriangle
} from "lucide-react"

export default function ExamModePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setProgress(65), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  const focusTopics = [
    { title: "Monetary Policy Tools", priority: "High", icon: Target },
    { title: "Keynesian vs Classical", priority: "Medium", icon: Brain },
    { title: "Fiscal Deficit Impact", priority: "High", icon: Zap },
  ]

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-headline font-bold text-secondary">Exam Mode</h1>
      </div>

      {/* Focus Status */}
      <Card className="rounded-[2.5rem] border-none bg-secondary text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
        <CardContent className="p-8 space-y-6 relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold uppercase tracking-widest px-3 py-1">Unit 1 & 2 Focus</Badge>
              <h2 className="text-3xl font-headline font-bold">65% Prepared</h2>
            </div>
            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-white/60">
              <span>Overall Readiness</span>
              <span className="text-primary">Target: 95%</span>
            </div>
            <Progress value={progress} className="h-3 bg-white/10" />
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex gap-3">
             <AlertTriangle className="h-5 w-5 text-primary shrink-0" />
             <p className="text-xs text-white/70 leading-relaxed italic">
               "Vani has identified <span className="text-primary font-bold">3 critical gaps</span> in your macroeconomics foundation. Focus on these before the mid-term."
             </p>
          </div>
        </CardContent>
      </Card>

      {/* High Priority Topics (Feature 24) */}
      <section className="space-y-4">
        <h3 className="font-headline font-bold text-lg flex items-center gap-2 px-1">
          <Sparkles className="h-5 w-5 text-primary" />
          Critical Review List
        </h3>
        <div className="grid gap-3">
          {focusTopics.map((topic, i) => (
            <Card key={i} className="rounded-3xl border-2 border-muted hover:border-primary/20 transition-all cursor-pointer group bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 bg-accent/50 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <topic.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-secondary">{topic.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={topic.priority === 'High' ? 'destructive' : 'secondary'} className="text-[8px] h-4 px-1.5 font-bold uppercase">
                      {topic.priority} Priority
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 15m review
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground group-hover:text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Exam Roadmap (Feature 17) */}
      <Card className="rounded-[2.5rem] bg-accent/30 border-2 border-dashed border-primary/20 p-8 text-center space-y-4">
        <div className="h-16 w-16 bg-white rounded-3xl flex items-center justify-center mx-auto text-primary shadow-lg shadow-primary/10">
          <Brain className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-headline font-bold text-secondary">Final Prep Marathon</h3>
          <p className="text-sm text-muted-foreground leading-relaxed px-4">
            Vani will generate a customized 4-hour study plan including mock questions from the last 5 years.
          </p>
        </div>
        <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 font-bold shadow-xl shadow-primary/30">
          Start Final Review
        </Button>
      </Card>

      {/* Stats (Feature 25) */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-3xl border-none bg-blue-50 p-5 space-y-2">
          <Flame className="h-5 w-5 text-blue-500 fill-blue-500" />
          <p className="text-2xl font-bold text-secondary">12d</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Prep Streak</p>
        </Card>
        <Card className="rounded-3xl border-none bg-emerald-50 p-5 space-y-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <p className="text-2xl font-bold text-secondary">88%</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Accuracy Rate</p>
        </Card>
      </div>
    </div>
  )
}
