
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Clock, AlertTriangle } from "lucide-react"

export default function ClassInsightsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-bold text-secondary">Class Insights</h1>

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

      <div className="space-y-4">
        <h3 className="font-headline font-bold text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Confusion Hotspots
        </h3>
        <Card className="rounded-3xl border-2 border-muted overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
               <span className="font-bold text-sm">Concept</span>
               <span className="font-bold text-sm">Confusion Index</span>
            </div>
            {[
              { label: "CRR vs SLR Dynamics", value: 78, color: "bg-destructive" },
              { label: "Money Multiplier", value: 45, color: "bg-orange-500" },
              { label: "Fiscal Deficit", value: 22, color: "bg-green-500" },
            ].map((hotspot, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>{hotspot.label}</span>
                  <span>{hotspot.value}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                   <div className={`h-full ${hotspot.color}`} style={{ width: `${hotspot.value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="p-6 bg-secondary text-white rounded-3xl">
        <h4 className="font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Recommendation
        </h4>
        <p className="text-xs text-white/70 leading-relaxed">
          The class is struggling with "CRR vs SLR". Consider recording a 2-minute "Vani Short" video specifically on this comparison to clear the doubts.
        </p>
      </div>
    </div>
  )
}
