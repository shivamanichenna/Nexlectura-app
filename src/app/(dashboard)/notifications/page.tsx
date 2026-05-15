
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, BookOpen, AlertCircle, Sparkles, CheckCircle2, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications] = useState([
    { id: 1, title: "New AI Summary Generated", body: "The summary for 'Macroeconomics Unit 4' is now available in your study hub.", type: "AI", date: "10m ago", icon: Sparkles, color: "text-primary", bg: "bg-primary/10" },
    { id: 2, title: "Exam Reminder", body: "Mid-term for Operating Systems is scheduled for Oct 25th. Start revising today!", type: "Alert", date: "2h ago", icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
    { id: 3, title: "Assignment Uploaded", body: "Prof. Murali has uploaded the weekly task for 'Banking & Credit'. Due in 3 days.", type: "Lecture", date: "Yesterday", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 4, title: "Streak Maintained!", body: "12 days in a row! You're building a great learning habit.", type: "System", date: "Yesterday", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  ])

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline font-bold text-secondary">Inbox</h1>
        <Button variant="ghost" size="sm" className="text-xs font-bold text-primary p-0">Mark all as read</Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <Card key={notif.id} className="rounded-3xl border-none bg-white shadow-sm border-2 border-muted hover:border-primary/20 transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-start gap-4">
              <div className={`h-11 w-11 rounded-2xl ${notif.bg} ${notif.color} flex items-center justify-center shrink-0`}>
                <notif.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-secondary truncate">{notif.title}</h4>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase shrink-0 ml-2">{notif.date}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{notif.body}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className="text-[9px] h-4 py-0 px-1.5 uppercase font-bold tracking-tight">{notif.type}</Badge>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Revision Prompt */}
      <Card className="bg-secondary text-white rounded-[2.5rem] border-none p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative z-10 space-y-4 text-center">
           <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
             <Sparkles className="h-7 w-7 text-primary" />
           </div>
           <div>
              <h3 className="text-xl font-headline font-bold">Exam Mode: Unit 1</h3>
              <p className="text-sm text-white/60 leading-relaxed mt-1">Based on your activity, AI has identified 3 topics that need quick revision before tomorrow's class.</p>
           </div>
           <Button className="w-full h-14 bg-primary hover:bg-primary/90 rounded-2xl font-bold shadow-lg shadow-primary/20">
             Enter Exam Mode
           </Button>
        </div>
      </Card>
    </div>
  )
}
