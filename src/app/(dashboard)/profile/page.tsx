"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Bell, 
  Edit2, 
  Share2, 
  Network, 
  Maximize2, 
  Clock, 
  TrendingUp, 
  Award, 
  Moon, 
  BellRing,
  LogOut
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth, useUser } from '@/firebase'
import { signOut } from 'firebase/auth'
import { Switch } from "@/components/ui/switch"

export default function ProfilePage() {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const auth = useAuth()
  const { user } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    if (!auth) return
    toast({ title: "Signing out...", description: "Please wait a moment." })
    try {
      await signOut(auth)
      localStorage.removeItem('nexlectra-role')
      router.push("/login")
    } catch (error: any) {
      toast({ variant: "destructive", title: "Sign out failed", description: error.message })
    }
  }

  if (!mounted) return null

  const userName = user?.displayName || user?.email?.split('@')[0] || "Eleanor Vance"

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] -mt-6 pb-24 font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 mt-2">
        <Avatar className="h-10 w-10 border border-gray-200">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.uid || 'eleanor'}`} />
          <AvatarFallback>EV</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold text-[#b04a11]" style={{ fontFamily: 'Georgia, serif' }}>
          Nexlectra
        </h1>
        <button className="text-gray-800 hover:opacity-70 transition-opacity">
          <Bell className="h-6 w-6" />
        </button>
      </div>

      <div className="px-5 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mt-2">
          <Avatar className="h-28 w-28 border-4 border-white shadow-xl mb-4">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.uid || 'eleanor'}`} />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            {userName}
          </h2>
          <p className="text-gray-500 text-sm font-medium mb-5">
            Senior Data Scientist · Deep Learning Track
          </p>
          
          <div className="flex items-center gap-3 w-full justify-center">
            <Button className="bg-[#b04a11] hover:bg-[#8e3b0d] text-white rounded-full px-6 shadow-md shadow-[#b04a11]/20 gap-2 h-11 w-40 font-semibold">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" className="rounded-full px-6 bg-white border-gray-200 shadow-sm gap-2 h-11 w-40 font-semibold text-gray-700 hover:bg-gray-50">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Knowledge Map */}
        <div className="bg-gradient-to-br from-[#f8f6f4] to-[#f0e9e1] rounded-[2rem] p-6 relative overflow-hidden border border-[#e6dbce] shadow-sm">
          <div className="absolute top-4 right-4 bg-white/60 p-2 rounded-full backdrop-blur-sm">
            <Maximize2 className="h-4 w-4 text-gray-700" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Network className="h-5 w-5 text-[#b04a11]" />
            <h3 className="text-xl text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Knowledge Map</h3>
          </div>
          <p className="text-sm text-gray-600 mb-8 font-medium">Your neural pathway of mastered concepts.</p>
          
          {/* Faux network visualization with CSS */}
          <div className="h-40 w-full relative flex items-center justify-center opacity-40">
             <div className="absolute w-[1px] h-32 bg-[#b04a11] rotate-45 transform origin-center"></div>
             <div className="absolute w-[1px] h-32 bg-[#b04a11] -rotate-45 transform origin-center"></div>
             <div className="absolute w-[1px] h-24 bg-[#b04a11] rotate-12 transform origin-center"></div>
             <div className="absolute w-[1px] h-40 bg-[#b04a11] -rotate-12 transform origin-center"></div>
             <div className="w-2 h-2 rounded-full bg-[#b04a11] absolute top-1/4 left-1/4"></div>
             <div className="w-3 h-3 rounded-full bg-[#b04a11] absolute top-1/2 left-1/2"></div>
             <div className="w-2 h-2 rounded-full bg-[#b04a11] absolute bottom-1/4 right-1/4"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-[#b04a11] absolute top-1/3 right-1/3"></div>
          </div>

          <div className="flex gap-2 relative z-10 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-gray-700 whitespace-nowrap shadow-sm">
              Machine Learning
            </div>
            <div className="bg-[#e66c2c] text-white px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm flex items-center gap-1.5">
              <Network className="h-3 w-3" /> Neural Networks
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-gray-700 whitespace-nowrap shadow-sm">
              Python API
            </div>
          </div>
        </div>

        {/* Deep Focus Time */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 text-gray-600 mb-4 uppercase tracking-widest text-xs font-bold">
            <Clock className="h-4 w-4" />
            <span>Deep Focus Time</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>142</span>
            <span className="text-xl text-gray-500 font-medium" style={{ fontFamily: 'Georgia, serif' }}>hrs</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#b04a11] text-xs font-bold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+12% vs last month</span>
          </div>
        </div>

        {/* Topics Mastered */}
        <div className="bg-[#2a2e37] rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-2 text-white/80 mb-4 uppercase tracking-widest text-xs font-bold">
            <Award className="h-4 w-4" />
            <span>Topics Mastered</span>
          </div>
          <div className="text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            48
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
            <div className="w-[90%] h-full bg-[#ff6b2b] rounded-full"></div>
          </div>
          <p className="text-white/60 text-xs font-medium">Next milestone at 50</p>
        </div>

        {/* System Preferences */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50">
            <h3 className="text-xl text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>System Preferences</h3>
          </div>
          
          <div className="px-6 py-5 flex items-center justify-between border-b border-gray-50">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <Moon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Dark Interface</p>
                <p className="text-xs text-gray-500">Reduce glare in low-light environments</p>
              </div>
            </div>
            <Switch />
          </div>

          <div className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-[#b04a11]">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Smart Notifications</p>
                <p className="text-xs text-gray-500 max-w-[200px]">AI-driven nudges for optimal learning retention</p>
              </div>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-[#b04a11]" />
          </div>
        </div>

        <Button 
          variant="ghost" 
          onClick={handleSignOut}
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 font-bold h-12 rounded-2xl"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
