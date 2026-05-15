"use client"

import { useState, useEffect } from "react"
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
  LogOut,
  Trophy,
  Users
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isLecturer, setIsLecturer] = useState(pathname.includes('/lecturer'))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedRole = localStorage.getItem('vani-role')
    setIsLecturer(pathname.includes('/lecturer') || savedRole === 'lecturer')
  }, [pathname])

  const handleSignOut = () => {
    toast({
      title: "Signing out...",
      description: "Please wait a moment.",
    })
    
    // Clear session
    localStorage.removeItem('vani-role')

    setTimeout(() => {
      toast({
        title: "Signed out successfully",
        description: "Come back soon to continue your journey!",
      })
      router.push("/")
    }, 800)
  }

  const settingsItems = [
    { icon: Settings, label: "Account Settings", desc: "Security, Privacy, Connected IDs" },
    { icon: Share2, label: "Refer a colleague", desc: "Invite others to Vani AI" },
    { icon: LogOut, label: "Sign Out", desc: "Logout from this device", color: "text-destructive", action: handleSignOut },
  ]

  const userData = isLecturer ? {
    name: "Prof. S. Murali Krishna",
    title: "Senior Lecturer • Economics",
    stats: [
      { icon: Users, value: "842", label: "Students" },
      { icon: BookOpen, value: "24", label: "Lectures" },
      { icon: Clock, value: "18h", label: "Teaching" },
    ]
  } : {
    name: "Arjun Kothari",
    title: "B.Tech Economics • Semester 4",
    stats: [
      { icon: Clock, value: "124h", label: "Learning" },
      { icon: BookOpen, value: "48", label: "Lectures" },
      { icon: Calendar, value: "12d", label: "Streak" },
    ]
  }

  if (!mounted) return null

  return (
    <div className="space-y-8 pb-10">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4 pt-4">
        <div className="relative">
          <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
            <AvatarImage src={`https://picsum.photos/seed/${isLecturer ? 'prof' : 'student'}-profile/200/200`} />
            <AvatarFallback>{userData.name[0]}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full border-2 border-white shadow-lg">
             {isLecturer ? <Award className="h-4 w-4 fill-current" /> : <Trophy className="h-4 w-4 fill-current" />}
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-headline font-bold text-secondary">{userData.name}</h1>
          <p className="text-muted-foreground text-sm font-medium">{userData.title}</p>
          <Badge className="bg-primary/10 text-primary border-none mt-2 px-4">{isLecturer ? "Vani Expert" : "Beta Explorer"}</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {userData.stats.map((stat, i) => (
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
      {!isLecturer && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline font-bold text-lg">Achievements</h3>
            <Button variant="link" className="text-primary font-bold p-0">View All</Button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 w-20 shrink-0 bg-accent rounded-2xl flex flex-col items-center justify-center text-accent-foreground border border-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
                <span className="text-[9px] font-bold mt-1 text-center">Early Bird</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings List */}
      <div className="space-y-3">
        {settingsItems.map((item, i) => (
          <Card 
            key={i} 
            className="rounded-2xl border-none bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
            onClick={item.action}
          >
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
