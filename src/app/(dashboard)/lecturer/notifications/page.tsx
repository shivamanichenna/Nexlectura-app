
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Megaphone, Clock, Plus, Trash2, Send } from "lucide-react"
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

  const handlePost = () => {
    if (!newTitle || !newBody) return
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
    toast({
      title: "Notification Sent",
      description: "Successfully broadcasted to all students in CSE-A.",
    })
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline font-bold text-secondary">Classroom Alerts</h1>
        <Badge variant="outline" className="text-primary border-primary">Active Center</Badge>
      </div>

      {/* Post New Notification */}
      <Card className="rounded-[2rem] border-2 border-primary/20 bg-primary/5 p-6 space-y-4">
        <h3 className="font-bold text-secondary flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          Broadcast to Students
        </h3>
        <div className="space-y-3">
          <Input 
            placeholder="Heading (e.g. Mid-term Date)" 
            className="rounded-xl border-none bg-white h-11"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Input 
            placeholder="Message body..." 
            className="rounded-xl border-none bg-white h-11"
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
          />
          <Button className="w-full h-11 rounded-xl font-bold gap-2" onClick={handlePost}>
            <Send className="h-4 w-4" /> Send Announcement
          </Button>
        </div>
      </Card>

      {/* History */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-lg">Sent History</h3>
        {notifications.map((n) => (
          <Card key={n.id} className="rounded-2xl border-none bg-white shadow-sm border-2 border-muted hover:border-primary/10 transition-all">
            <CardContent className="p-5 flex items-start gap-4">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                n.type === 'Announcement' ? 'bg-blue-100 text-blue-600' : 
                n.type === 'Reminder' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-secondary">{n.title}</h4>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">{n.date}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.body}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className="text-[9px] h-4 py-0 px-1.5 uppercase">{n.class}</Badge>
                  <Badge variant="outline" className="text-[9px] h-4 py-0 px-1.5 uppercase">{n.type}</Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
