
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckCircle2, Clock, FileText, ChevronRight, AlertCircle, Sparkles } from "lucide-react"

export default function AssignmentManagementPage() {
  const [assignments] = useState([
    { id: 1, title: "Supply & Demand Analysis", class: "CSE-A", due: "Tomorrow", submissions: 42, total: 64, status: "Active" },
    { id: 2, title: "Banking Case Study", class: "CSE-A", due: "Oct 24", submissions: 12, total: 64, status: "Active" },
    { id: 3, title: "Mid-term Review Paper", class: "EC-B", due: "Expired", submissions: 58, total: 58, status: "Graded" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline font-bold text-secondary">Assignments</h1>
        <Button className="rounded-xl h-10 font-bold gap-2">
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </div>

      {/* AI Assistant for Lecturers */}
      <Card className="rounded-3xl bg-secondary text-white border-none p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-sm">AI Assignment Builder</h3>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Let AI generate a task based on your last 3 lectures. Includes problem statements and grading rubrics.
          </p>
          <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl h-10 text-xs font-bold">
            Generate Weekly Task
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="font-headline font-bold text-lg">Active Assignments</h3>
        {assignments.map((task) => (
          <Card key={task.id} className="rounded-3xl border-2 border-muted hover:border-primary/20 transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${task.status === 'Active' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}`}>
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-secondary">{task.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[9px] h-4 py-0 font-bold uppercase">{task.class}</Badge>
                  <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Due {task.due}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(task.submissions / task.total) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-secondary">{task.submissions}/{task.total}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100 flex gap-4">
        <AlertCircle className="h-6 w-6 text-blue-500 shrink-0 mt-1" />
        <div className="space-y-1">
           <h4 className="font-bold text-secondary text-sm">Grading Reminder</h4>
           <p className="text-xs text-muted-foreground leading-relaxed">
             The "Mid-term Review Paper" for EC-B is ready for grading. AI has pre-evaluated 45/58 submissions.
           </p>
           <Button variant="link" className="text-blue-500 font-bold p-0 text-xs h-auto">Start Grading Now</Button>
        </div>
      </div>
    </div>
  )
}
