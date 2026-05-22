"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { Bell, Users, TrendingUp, HelpCircle, BookOpen, ChevronRight } from "lucide-react"
import { useFirestore, useUser, useDoc, useCollection } from '@/firebase'
import { doc, collection, query, where } from 'firebase/firestore'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function LecturerDashboard() {
  const router = useRouter()
  const db = useFirestore()
  const { user } = useUser()

  const lecturerRef = useMemo(() => (db && user ? doc(db, 'lecturers', user.uid) : null), [db, user]);
  const { data: profile } = useDoc(lecturerRef);

  const lecturesQuery = useMemo(() => {
    if (!db || !user) return null
    return query(
      collection(db, 'lectures'),
      where('lecturerId', '==', user.uid)
    )
  }, [db, user])
  const { data: lectures } = useCollection(lecturesQuery)

  const stats = useMemo(() => {
    if (!lectures) return { activeStudents: 1240, engagement: 88, pendingDoubts: 14, avgProgress: 72 }
    return {
      activeStudents: lectures.reduce((acc: number, l: any) => acc + (l.enrolledCount || 0), 0) || 1240,
      engagement: 88,
      pendingDoubts: 14,
      avgProgress: 72
    }
  }, [lectures])

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] p-6 pb-24 max-w-md mx-auto font-sans">
      {/* Top App Bar */}
      <div className="flex items-center justify-between mb-8 -mx-2">
        <Avatar className="h-10 w-10 border shadow-sm">
          <AvatarImage src="https://i.pravatar.cc/150?u=dr_sarah" alt="Profile" />
          <AvatarFallback>DR</AvatarFallback>
        </Avatar>
        <span className="font-bold text-lg text-[#b04a11] font-serif tracking-wide">Nexlectra</span>
        <button className="text-[#b04a11] hover:opacity-70 transition-opacity">
          <Bell className="h-6 w-6" />
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-gray-900 leading-tight">
          Good Morning,
        </h1>
        <h2 className="text-[32px] font-bold text-gray-500 leading-tight">
          {user?.displayName ? `Prof. ${user.displayName.split(' ')[0]}` : (profile?.name ? `Prof. ${profile.name.split(' ')[0]}` : `Prof. ${user?.email?.split('@')[0] || 'Sarah'}`)}
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {/* Active Students */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-bold">Active Students</span>
            <Users className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl text-gray-800">{stats.activeStudents.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-[#b04a11] flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +4% this week
            </p>
          </div>
        </div>

        {/* Engagement */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-bold">Engagement</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl text-gray-800">{stats.engagement}%</p>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#b04a11] rounded-full transition-all" style={{ width: `${stats.engagement}%` }} />
            </div>
          </div>
        </div>

        {/* Pending Doubts */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-bold">Pending Doubts</span>
            <HelpCircle className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl text-[#ff6b2b]">{stats.pendingDoubts}</p>
            <p className="text-[10px] font-bold text-gray-400">Needs attention</p>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-bold">Course Progress</span>
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl text-gray-800">{stats.avgProgress}%</p>
            <p className="text-[10px] font-bold text-gray-400">Ahead of schedule</p>
          </div>
        </div>
      </div>

      {/* AI Shortcuts */}
      <div>
        <h3 className="text-[15px] font-medium text-gray-800 mb-4 px-1">AI Shortcuts</h3>
        <div className="space-y-3">
          {[
            { label: "Draft Assignment", path: "#" },
            { label: "Summarize Weaknesses", path: "#" },
            { label: "Generate Quiz", path: "#" },
            { label: "Analyze Feedback", path: "#" },
          ].map((item, i) => (
            <button 
              key={i}
              className="w-full bg-white rounded-[2rem] p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:border-[#ff6b2b]/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-[#ffebdb] rounded-full flex items-center justify-center shrink-0" />
                <span className="font-bold text-gray-900 text-[15px]">{item.label}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#ff6b2b] transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
