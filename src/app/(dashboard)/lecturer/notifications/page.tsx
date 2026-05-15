
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Megaphone, Clock, Plus, Trash2, Send, History, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LecturerNotifications() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Exam Date Announced", body: "The Macroeconomics mid-term is scheduled for Oct 25th.", class: "All Classes", date: "10 mins ago", type: "Announcement" },
    { id: 2, title: "Assignment Deadline", body: "Submit your Banking Case Studies by tomorrow 5 PM.", class: "CSE-A", date: "2h ago", type: "Reminder" },
    { id: 3, title: "New Lecture Uploaded", body: "Unit 4: Money Multiplier is now live.", class: "EC-B", date: "Yesterday", type: "Alert" },
  ])

  const [newTitle, setNewTitle] = useState("")
  const [newBody, setNewBody] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handlePost = () => {
    if (!newTitle || !newBody) return
    setIsSending(true)
    
    setTimeout(() => {
      const newNotif = {
        id: Date.now(),
        title: newTitle,
        body: newBody,
        class: "CSE-A",
        date: "Just now",
        type: "Announcement"
      }
      setNotifications([newNotif, ...notifications])
      setNewTitle("")
      setNewBody("")
      setIsSending(false)
      toast({
        title: "Broadcast Successful!",
        description: "Notification sent to all students in Section CSE-A.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-2xl font-headline font-bold text-secondary">Broadcast Center</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Feature 14 • Student Alerts</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary font-bold">LIVE HUB</Badge>
      </div>

      {/* Post New Notification */}
      <Card className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-secondary/5 border-2 border-muted p-7 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Megaphone className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-secondary text-base">Compose Broadcast</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Headline</p>
            <Input 
              placeholder="e.g. Mid-term Postponed" 
              className="rounded-2xl border-none bg-muted/40 h-12 text-sm font-medium"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Message Body</p>
            <Input 
              placeholder="Details for your students..." 
              className="rounded-2xl border-none bg-muted/40 h-12 text-sm font-medium"
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button className="flex-1 h-14 rounded-2xl font-bold gap-2 shadow-lg shadow-primary/20" onClick={handlePost} disabled={isSending}>
              <Send className="h-4 w-4" /> {isSending ? "Sending..." : "Send to All Students"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Broadcast History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Sent History
          </h3>
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Last 30 Days</span>
        </div>
        
        {notifications.map((n) => (
          <Card key={n.id} className="rounded-[2rem] border-none bg-white shadow-sm border-2 border-muted hover:border-primary/10 transition-all overflow-hidden">
            <CardContent className="p-5 flex items-start gap-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                n.type === 'Announcement' ? 'bg-blue-50 text-blue-600' : 
                n.type === 'Reminder' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <Bell className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-secondary truncate pr-2">{n.title}</h4>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase shrink-0 mt-0.5">{n.date}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{n.body}</p>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="text-[8px] h-4 py-0 px-2 uppercase font-bold tracking-tight">{n.class}</Badge>
                  <Badge variant="outline" className="text-[8px] h-4 py-0 px-2 uppercase font-bold tracking-tight border-muted-foreground/30">{n.type}</Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5 rounded-full shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-accent/50 p-6 rounded-[2.5rem] border border-primary/10 flex gap-4">
         <AlertCircle className="h-6 w-6 text-primary shrink-0" />
         <p className="text-xs text-muted-foreground leading-relaxed">
           <span className="font-bold text-secondary">Pro-tip:</span> Critical alerts (like exam reminders) are automatically prioritized in the student's Vani Home Feed.
         </p>
      </div>
    </div>
  )
}
