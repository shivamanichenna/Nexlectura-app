
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Plus, 
  Play, 
  ChevronRight,
  Eye,
  Settings,
  MoreVertical
} from "lucide-react"
import Image from "next/image"

export default function LecturerDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-muted-foreground font-medium text-sm">Welcome back,</h2>
          <h1 className="text-2xl font-headline font-bold text-secondary">Prof. S. Murali Krishna</h1>
        </div>
        <Button size="icon" variant="ghost" className="rounded-full bg-muted/50">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-3xl border-none bg-primary/10 text-primary">
          <CardContent className="p-4 space-y-2">
            <Users className="h-6 w-6" />
            <div>
              <p className="text-2xl font-bold">842</p>
              <p className="text-[10px] font-bold uppercase">Active Students</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-none bg-blue-500/10 text-blue-600">
          <CardContent className="p-4 space-y-2">
            <MessageCircle className="h-6 w-6" />
            <div>
              <p className="text-2xl font-bold">14</p>
              <p className="text-[10px] font-bold uppercase">Unresolved Doubts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Action: Upload */}
      <Card className="rounded-[2rem] bg-secondary text-white border-none overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
        <CardContent className="p-6 relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">New Lecture</h3>
              <p className="text-white/60 text-xs">Upload transcript or video</p>
            </div>
          </div>
          <Button className="w-full bg-white text-secondary hover:bg-white/90 font-bold h-12 rounded-xl">
            <Upload className="h-4 w-4 mr-2" />
            Start Uploading
          </Button>
        </CardContent>
      </Card>

      {/* Class Performance */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Class Performance
          </h3>
          <Button variant="link" size="sm" className="text-primary font-bold">See Analytics</Button>
        </div>
        <Card className="rounded-3xl border-2 border-muted">
          <CardContent className="p-5">
            <div className="flex items-end justify-between h-24 gap-2">
              {[40, 60, 45, 90, 75, 85, 65].map((h, i) => (
                <div key={i} className="flex-1 bg-muted rounded-t-lg relative group">
                  <div 
                    className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-500 ${i === 3 ? 'bg-primary' : 'bg-primary/40'}`} 
                    style={{ height: `${h}%` }} 
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold bg-secondary text-white px-1.5 py-0.5 rounded">{h}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-[10px] font-bold text-muted-foreground uppercase">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Lectures Uploaded */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-lg">Recent Lectures</h3>
        <div className="space-y-3">
          {[
            { id: "1", title: "Banking and Credit Control", subject: "Economics", views: 420, doubts: 5 },
            { id: "2", title: "National Income Accounting", subject: "Economics", views: 385, doubts: 2 },
          ].map((lec) => (
            <Card key={lec.id} className="rounded-2xl border-none bg-white shadow-sm border-2 border-muted hover:border-primary/20 transition-all cursor-pointer">
              <CardContent className="p-4 flex gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <Image src={`https://picsum.photos/seed/prof-${lec.id}/200/200`} alt="thumb" fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-secondary text-sm leading-tight">{lec.title}</h4>
                    <p className="text-[10px] text-muted-foreground font-medium">{lec.subject}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
                      <Eye className="h-3 w-3" /> {lec.views}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
                      <MessageCircle className="h-3 w-3" /> {lec.doubts} Doubts
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Student Shoutouts/Alerts */}
      <div className="bg-accent/50 p-5 rounded-3xl border border-accent flex gap-4">
        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
          <MessageCircle className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-secondary text-sm">Critical Doubt Alert</h4>
          <p className="text-xs text-muted-foreground mt-1">
            5 students are confused about <span className="text-primary font-bold">"CRR vs SLR"</span> in Chapter 4. 
            <button className="text-primary font-bold ml-1 hover:underline">Reply with Video Hint?</button>
          </p>
        </div>
      </div>
    </div>
  )
}
