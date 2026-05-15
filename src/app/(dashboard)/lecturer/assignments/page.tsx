
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ChevronRight, 
  AlertCircle, 
  Sparkles, 
  ClipboardList,
  Target,
  Wand2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AssignmentManagementPage() {
  const { toast } = useToast()
  const [assignments] = useState([
    { id: 1, title: "Supply & Demand Analysis", class: "CSE-A", due: "Tomorrow", submissions: 42, total: 64, status: "Active" },
    { id: 2, title: "Banking Case Study", class: "CSE-A", due: "Oct 24", submissions: 12, total: 64, status: "Active" },
    { id: 3, title: "Mid-term Review Paper", class: "EC-B", due: "Expired", submissions: 58, total: 58, status: "Graded" },
  ])

  const handleAIBuilder = () => {
    toast({
      title: "AI Builder Triggered",
      description: "Generating assignment based on your last 3 lecture transcripts...",
    })
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-2xl font-headline font-bold text-secondary">Assignment Hub</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Feature 9 • Task Management</p>
        </div>
        <Button className="rounded-xl h-11 font-bold gap-2 shadow-lg">
          <Plus className="h-4 w-4" /> Create Manual
        </Button>
      </div>

      {/* AI Assistant for Lecturers (Feature 9 & 21) */}
      <Card className="rounded-[2.5rem] bg-secondary text-white border-none p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base">Vani Assignment Builder</h3>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Let AI generate a weekly task based on your classroom notes. Includes problem statements, evaluation rubrics, and predicted student friction points.
          </p>
          <Button onClick={handleAIBuilder} className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 font-bold shadow-xl shadow-primary/30 gap-2">
            <Wand2 className="h-4 w-4" /> Build Smart Task
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Classroom Tasks
          </h3>
          <Badge className="bg-orange-100 text-orange-600 border-none font-bold text-[10px]">3 ACTIVE</Badge>
        </div>
        
        {assignments.map((task) => (
          <Card key={task.id} className="rounded-3xl border-2 border-muted hover:border-primary/20 transition-all cursor-pointer group bg-white shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${task.status === 'Active' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
                <FileText className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-secondary truncate">{task.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[8px] h-4 py-0 font-bold uppercase border-muted-foreground/30">{task.class}</Badge>
                  <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Due {task.due}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(task.submissions / task.total) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-secondary shrink-0">{task.submissions}/{task.total} Turn-ins</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[2rem] border-none bg-blue-50/50 p-6 flex gap-4 border border-blue-100">
        <AlertCircle className="h-6 w-6 text-blue-500 shrink-0 mt-1" />
        <div className="space-y-2">
           <h4 className="font-bold text-secondary text-sm">Automated Grading Assist</h4>
           <p className="text-xs text-muted-foreground leading-relaxed">
             AI has pre-evaluated <span className="font-bold text-blue-600">45/58 submissions</span> for "Mid-term Review Paper". Tap to review and release scores.
           </p>
           <Button variant="link" className="text-blue-500 font-bold p-0 text-xs h-auto flex items-center gap-1">
             Go to Grading Suite <ChevronRight className="h-3 w-3" />
           </Button>
        </div>
      </Card>
    </div>
  )
}
