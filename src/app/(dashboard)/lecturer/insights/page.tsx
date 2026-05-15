
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Clock, AlertTriangle, ArrowUpRight, Brain, Zap, Target } from "lucide-react"

export default function ClassInsightsPage() {
  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-2xl font-headline font-bold text-secondary">Class Performance</h1>

      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-3xl border-none bg-accent/50">
          <CardContent className="p-5 space-y-2">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xl font-bold">85%</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Participation</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-none bg-accent/50">
          <CardContent className="p-5 space-y-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xl font-bold">4.2h</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Avg Study Time</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Improvement Tracking */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-500" />
          Student Improvement Trends
        </h3>
        <Card className="rounded-3xl border-2 border-muted p-6 space-y-6">
          {[
            { name: "Learning Consistency", value: 72, trend: "+12%", color: "bg-emerald-500" },
            { name: "Quiz Performance", value: 64, trend: "+5%", color: "bg-blue-500" },
            { name: "Doubt Resolution", value: 88, trend: "+24%", color: "bg-primary" },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold text-secondary">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Class Average</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-secondary">{item.value}%</p>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <ArrowUpRight className="h-3 w-3" /> {item.trend}
                  </p>
                </div>
              </div>
              <Progress value={item.value} className="h-2 bg-muted rounded-full" />
            </div>
          ))}
        </Card>
      </div>

      {/* Confusion Hotspots */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          AI Detected Confusion Areas
        </h3>
        <Card className="rounded-3xl border-2 border-muted overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
               <span className="font-bold text-sm">Concept</span>
               <span className="font-bold text-sm">Difficulty Level</span>
            </div>
            {[
              { label: "CRR vs SLR Dynamics", value: 78, color: "bg-destructive", status: "Critical" },
              { label: "Money Multiplier", value: 45, color: "bg-orange-500", status: "Moderate" },
              { label: "Fiscal Deficit", value: 22, color: "bg-green-500", status: "Low" },
            ].map((hotspot, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="font-bold">{hotspot.label}</span>
                  <Badge variant="outline" className={`text-[9px] h-4 py-0 ${
                    hotspot.status === 'Critical' ? 'text-destructive border-destructive' : 'text-orange-500 border-orange-500'
                  }`}>{hotspot.status}</Badge>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                   <div className={`h-full ${hotspot.color}`} style={{ width: `${hotspot.value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendation */}
      <div className="p-6 bg-secondary text-white rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full -mr-12 -mt-12 blur-xl" />
        <div className="relative z-10 space-y-3">
          <h4 className="font-bold flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            AI Teaching Strategy
          </h4>
          <p className="text-xs text-white/70 leading-relaxed">
            Students are consistently failing the "CRR vs SLR" quiz. <span className="text-white font-bold">Strategy:</span> Re-explain using the "Lock & Key" analogy which performed well in EC-B last semester.
          </p>
          <Button variant="outline" className="w-full h-10 rounded-xl text-xs font-bold border-white/20 text-white hover:bg-white/5">
            Apply Recommendation
          </Button>
        </div>
      </div>
    </div>
  )
}
