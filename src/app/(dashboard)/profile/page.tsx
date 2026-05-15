
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
  Users,
  Star,
  Zap,
  Medal,
  Target
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/firebase'
import { signOut } from 'firebase/auth'

export default function ProfilePage() {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const auth = useAuth()
  const [isLecturer, setIsLecturer] = useState(pathname.includes('/lecturer'))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedRole = localStorage.getItem('vani-role')
    setIsLecturer(pathname.includes('/lecturer') || savedRole === 'lecturer')
  }, [pathname])

  const handleSignOut = async () => {
    if (!auth) return

    toast({
      title: "Signing out...",
      description: "Please wait a moment.",
    })
    
    try {
      await signOut(auth)
      localStorage.removeItem('vani-role')
      toast({
        title: "Signed out successfully",
        description: "Come back soon to continue your journey!",
      })
      router.push("/login")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out.",
      })
    }
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
    xp: 2450,
    level: 12,
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
          {!isLecturer && (
            <div className="flex items-center gap-2 justify-center mt-3">
               <Badge className="bg-secondary text-white border-none px-3 py-1 gap-1.5">
                  <Star className="h-3 w-3 text-primary fill-primary" />
                  Level {userData.level}
               </Badge>
               <Badge variant="outline" className="border-primary text-primary font-bold">Silver II</Badge>
            </div>
          )}
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

      {/* Achievement & Milestones (Feature 15) */}
      {!isLecturer && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-headline font-bold text-lg">Milestones</h3>
              <span className="text-xs font-bold text-primary">6/12 Badges</span>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {[
                { label: "Night Owl", icon: Medal, color: "text-indigo-500", bg: "bg-indigo-50" },
                { label: "Top 1%", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50" },
                { label: "Early Bird", icon: Zap, color: "text-primary", bg: "bg-primary/5" },
                { label: "Consistency", icon: Target, color: "text-emerald-500", bg: "bg-emerald-50" },
              ].map((badge, i) => (
                <div key={i} className={`h-24 w-24 shrink-0 ${badge.bg} rounded-[2rem] flex flex-col items-center justify-center border-2 border-white shadow-sm transition-transform hover:scale-105 cursor-pointer`}>
                  <badge.icon className={`h-10 w-10 ${badge.color}`} />
                  <span className="text-[10px] font-bold mt-2 text-secondary">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="rounded-3xl border-none bg-secondary text-white p-6 relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
             <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Global Rank</p>
                   <h4 className="text-2xl font-headline font-bold">#482</h4>
                   <p className="text-[10px] text-white/50">Top 15% of Vani Students</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold">Next Rank</p>
                   <p className="text-sm font-bold text-primary">Gold III</p>
                </div>
             </div>
          </Card>
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
