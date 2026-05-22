"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, BookOpen, AlertCircle, Sparkles, CheckCircle2, ChevronRight } from "lucide-react"

export default function NotificationsPage() {
  const [notifications] = useState([
    { id: 1, title: "New AI Summary Generated", body: "The summary for 'Macroeconomics Unit 4' is now available in your study hub.", type: "AI", date: "10m ago", icon: Sparkles, color: "text-[#b04a11]", bg: "bg-[#ffebdb]" },
    { id: 2, title: "Exam Reminder", body: "Mid-term for Operating Systems is scheduled for Oct 25th. Start revising today!", type: "Alert", date: "2h ago", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
    { id: 3, title: "Assignment Uploaded", body: "Prof. Murali has uploaded the weekly task for 'Banking & Credit'. Due in 3 days.", type: "Lecture", date: "Yesterday", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 4, title: "Streak Maintained!", body: "12 days in a row! You're building a great learning habit.", type: "System", date: "Yesterday", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
  ])

  return (
    <div className="space-y-6 pb-24 font-sans bg-[#fafafa] min-h-screen px-2">
      <div className="flex justify-between items-center py-2 px-1">
        <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Inbox</h1>
        <Button variant="ghost" size="sm" className="text-xs font-bold text-[#b04a11] hover:bg-[#ffebdb] p-2 rounded-xl">Mark all as read</Button>
      </div>

      <div className="space-y-3 px-1">
        {notifications.map((notif) => (
          <Card key={notif.id} className="rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:border-[#b04a11]/20 transition-all cursor-pointer group overflow-hidden">
            <CardContent className="p-4 flex items-start gap-4">
              <div className={`h-12 w-12 rounded-[1.25rem] ${notif.bg} ${notif.color} flex items-center justify-center shrink-0`}>
                <notif.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-[15px] text-gray-900 truncate pr-2">{notif.title}</h4>
                  <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0 mt-1">{notif.date}</span>
                </div>
                <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2 pr-2">{notif.body}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-none text-[9px] h-5 px-2 uppercase font-bold tracking-tight rounded-md">{notif.type}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Revision Prompt */}
      <div className="px-1 mt-6">
        <Card className="bg-[#b04a11] text-white rounded-[2.5rem] border-none p-7 shadow-lg shadow-[#b04a11]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl" />
          <div className="relative z-10 space-y-4 text-center">
             <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
               <Sparkles className="h-7 w-7 text-white" />
             </div>
             <div>
                <h3 className="text-[22px] font-bold">Exam Mode: Unit 1</h3>
                <p className="text-[13px] text-white/80 leading-relaxed mt-2 font-medium px-2">Based on your activity, AI has identified 3 topics that need quick revision before tomorrow's class.</p>
             </div>
             <Button className="w-full h-14 bg-white text-[#b04a11] hover:bg-gray-50 rounded-2xl font-bold shadow-md text-[15px] mt-2">
               Enter Exam Mode
             </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
