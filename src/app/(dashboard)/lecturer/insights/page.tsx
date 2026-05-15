
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  Users, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  Brain, 
  Zap, 
  Target, 
  Download, 
  FileBarChart,
  Activity,
  Award,
  Search
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

export default function ClassInsightsPage() {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = (type: string) => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: "Report Generated",
        description: `Your ${type} performance report for CSE-A has been downloaded.`,
      })
    }, 1500)
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-headline font-bold text-secondary">Classroom Analytics</h1>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase px-3 py-1">Semester 5 • CSE-A</Badge>
          <div className="flex gap-1 ml-auto">
             <Button variant="outline" size="sm" onClick={() => handleExport('PDF')} className="rounded-lg h-9 font-bold text-[10px] gap-1.5 border-primary text-primary hover:bg-primary/5">
                <Download className="h-3.5 w-3.5" /> PDF
             </Button>
             <Button variant="outline" size="sm" onClick={() => handleExport('CSV')} className="rounded-lg h-9 font-bold text-[10px] gap-1.5 border-primary text-primary hover:bg-primary/5">
                <FileBarChart className="h-3.5 w-3.5" /> CSV
             </Button>
          </div>
        </div>
      </div>

      {/* High Level Metrics (Feature 11) */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-3xl border-none bg-blue-50/50 shadow-sm border border-blue-100">
          <CardContent className="p-5 space-y-3">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">85%</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Active Engagement</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-none bg-emerald-50/50 shadow-sm border border-emerald-100">
          <CardContent className="p-5 space-y-3">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">74%</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Concept Mastery</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Improvement Tracking (Feature 12) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Growth Trends
          </h3>
          <span className="text-[10px] font-bold text-emerald-600 uppercase">+15% vs Last Month</span>
        </div>
        <Card className="rounded-[2rem] border-2 border-muted p-6 space-y-6 bg-white shadow-xl shadow-secondary/5">
          {[
            { name: "Learning Consistency", value: 72, trend: "+12%", color: "bg-emerald-500" },
            { name: "Quiz Performance", value: 64, trend: "+5%", color: "bg-blue-500" },
            { name: "Doubt Resolution", value: 88, trend: "+24%", color: "bg-primary" },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold text-secondary">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Aggregated Student Data</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-secondary">{item.value}%</p>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <ArrowUpRight className="h-3 w-3" /> {item.trend}
                  </p>
                </div>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Confusion Hotspots (Feature 13) */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-lg flex items-center gap-2 px-1">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          AI Friction Analysis
        </h3>
        <Card className="rounded-[2.5rem] border-none bg-secondary text-white p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center text-primary">
                <Brain className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Top Struggles Identified by Vani</p>
            </div>
            
            <div className="space-y-4">
              {[
                { label: "Memory Management vs Pagination", value: 78, status: "Critical", desc: "42 students asked similar doubts" },
                { label: "Virtual Memory Swap Space", value: 45, status: "Moderate", desc: "Average quiz score below 60%" },
                { label: "Deadlock Detection", value: 22, status: "Low", desc: "Concepts showing steady improvement" },
              ].map((hotspot, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white/90">{hotspot.label}</span>
                    <Badge variant="outline" className={`text-[8px] h-4 py-0 ${
                      hotspot.status === 'Critical' ? 'text-destructive border-destructive bg-destructive/10' : 
                      hotspot.status === 'Moderate' ? 'text-orange-400 border-orange-400 bg-orange-400/10' : 'text-emerald-400 border-emerald-400 bg-emerald-400/10'
                    }`}>{hotspot.status}</Badge>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className={`h-full ${hotspot.status === 'Critical' ? 'bg-destructive' : hotspot.status === 'Moderate' ? 'bg-orange-400' : 'bg-emerald-400'}`} style={{ width: `${hotspot.value}%` }} />
                  </div>
                  <p className="text-[9px] text-white/40 font-bold uppercase tracking-tight">{hotspot.desc}</p>
                </div>
              ))}
            </div>

            <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 font-bold text-xs shadow-xl shadow-primary/30">
              <Zap className="h-4 w-4 mr-2" /> Generate Revision Module
            </Button>
          </div>
        </Card>
      </div>

      {/* Top Performers (Feature 11) */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-lg flex items-center gap-2 px-1">
          <Award className="h-5 w-5 text-yellow-500" />
          Top Performers
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "Arjun K.", score: "98%", id: "VU202" },
            { name: "Sneha R.", score: "95%", id: "VU208" },
            { name: "Rahul V.", score: "92%", id: "VU212" },
          ].map((student, i) => (
            <Card key={i} className="rounded-2xl border-none bg-white p-4 text-center space-y-2 shadow-sm">
               <div className="h-10 w-10 rounded-full bg-yellow-50 mx-auto flex items-center justify-center text-yellow-600 font-bold text-xs">#{i+1}</div>
               <div>
                  <p className="font-bold text-xs text-secondary truncate">{student.name}</p>
                  <p className="text-[9px] text-muted-foreground font-bold">{student.score}</p>
               </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
