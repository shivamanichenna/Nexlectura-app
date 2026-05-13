"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Award, 
  Calendar, 
  BookOpen, 
  Clock, 
  Share2,
  ChevronRight,
  LogOut
} from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4 pt-4">
        <div className="relative">
          <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
            <AvatarImage src="https://picsum.photos/seed/wani-student/200/200" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full border-2 border-white shadow-lg">
             <Award className="h-4 w-4 fill-current" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-headline font-bold text-secondary">Arjun Kothari</h1>
          <p className="text-muted-foreground text-sm font-medium">B.Tech Economics • Semester 4</p>
          <Badge className="bg-primary/10 text-primary border-none mt-2 px-4">Beta Explorer</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Clock, value: "124h", label: "Learning" },
          { icon: BookOpen, value: "48", label: "Lectures" },
          { icon: Calendar, value: "12d", label: "Streak" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
             <div className="h-10 w-10 bg-muted/50 rounded-xl flex items-center justify-center text-muted-foreground">
               <stat.icon className="h-5 w-5" />
             </div>
             <p className="font-bold text-secondary mt-1">{stat.value}</p>
             <p className="text-[10px] font-bold text-muted-foreground uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Achievement Row */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-headline font-bold text-lg">Achievements</h3>
          <Button variant="link" className="text-primary font-bold p-0">View All</Button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 w-20 shrink-0 bg-accent rounded-2xl flex flex-col items-center justify-center text-accent-foreground border border-primary/10">
              <TrophyIcon className="h-8 w-8 text-primary" />
              <span className="text-[9px] font-bold mt-1 text-center">Early Bird</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-3">
        {[
          { icon: Settings, label: "Account Settings", desc: "Security, Privacy, Connected IDs" },
          { icon: Share2, label: "Refer a classmate", desc: "Get 1 month Vani Pro for free" },
          { icon: LogOut, label: "Sign Out", desc: "Logout from this device", color: "text-destructive" },
        ].map((item, i) => (
          <Card key={i} className="rounded-2xl border-none bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
               <div className={`h-10 w-10 rounded-xl bg-white flex items-center justify-center ${item.color || 'text-muted-foreground'}`}>
                 <item.icon className="h-5 w-5" />
               </div>
               <div className="flex-1">
                  <h4 className={`font-bold text-sm ${item.color || 'text-secondary'}`}>{item.label}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
               </div>
               <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 22V18" />
      <path d="M14 22V18" />
      <path d="M18 4H6v7a6 6 0 0 0 12 0V4Z" />
    </svg>
  )
}
