"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ClipboardCheck, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  Trophy,
  AlertCircle
} from "lucide-react"

export default function AssessmentsPage() {
  const tests = [
    { title: "Macroeconomics Mid-Term", subject: "Economics", questions: 30, time: "45 min", type: "Weekly Mock" },
    { title: "Introduction to Calculus", subject: "Mathematics", questions: 20, time: "30 min", type: "AI Practice" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline font-bold text-secondary">Assessments</h1>
        <Badge className="bg-primary/10 text-primary border-none rounded-lg py-1 px-3">8.4 CGPA</Badge>
      </div>

      {/* Readiness Widget */}
      <Card className="bg-secondary text-white rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
        <CardContent className="p-6 relative z-10 flex items-center justify-between">
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
                <TrendingUp className="h-4 w-4" />
                Exam Readiness
             </div>
             <h2 className="text-3xl font-headline font-bold">78%</h2>
             <p className="text-white/60 text-sm">You are 12% more prepared than last week. Great progress!</p>
          </div>
          <div className="h-24 w-24 rounded-full border-8 border-primary/20 flex items-center justify-center">
             <div className="h-full w-full border-t-8 border-primary rounded-full rotate-45 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-primary" />
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Section: Upcoming */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-headline font-bold text-lg">Upcoming Tests</h3>
          <Button variant="link" className="text-primary font-bold">View History</Button>
        </div>
        <div className="space-y-3">
          {tests.map((test, idx) => (
            <Card key={idx} className="rounded-2xl border-2 border-muted overflow-hidden hover:border-primary/20 transition-all group">
              <CardContent className="p-0">
                <div className="p-4 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center text-secondary">
                    <ClipboardCheck className="h-7 w-7" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                       <h4 className="font-bold text-secondary text-sm">{test.title}</h4>
                       <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4 uppercase">{test.type}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {test.time}</span>
                      <span>•</span>
                      <span>{test.questions} Questions</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Analysis Widget */}
      <div className="p-5 bg-destructive/5 rounded-3xl border border-destructive/10 flex gap-4">
         <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-1" />
         <div className="space-y-1">
            <h4 className="font-bold text-secondary text-sm">Mistake Analysis</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In your last Mock, you lost most points in <span className="text-destructive font-bold">Macro-Dynamics</span>. Vani has generated a special practice set to fix this.
            </p>
            <Button variant="link" className="p-0 h-auto text-primary text-xs font-bold underline">Fix Weak Topics Now</Button>
         </div>
      </div>
    </div>
  )
}
