"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Flame, Sparkles, Megaphone, CheckCircle2, PlayCircle, Loader2 } from "lucide-react"
import { useAuth, useUser, useFirestore, useDoc, useCollection } from '@/firebase'
import { doc, collection, query, where, limit } from 'firebase/firestore'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default function StudentDashboard() {
  const [mounted, setMounted] = useState(false)
  const [greeting, setGreeting] = useState("Good morning")
  const { user } = useUser()
  const db = useFirestore()

  const profileRef = useMemo(() => (db && user ? doc(db, 'users', user.uid) : null), [db, user]);
  const { data: profile } = useDoc(profileRef)
  
  const lecturesQuery = useMemo(() => (db && user ? query(collection(db, 'lectures'), where('status', '==', 'processed'), limit(5)) : null), [db, user]);
  const { data: lectures, loading: lecturesLoading } = useCollection(lecturesQuery)

  const assessmentsQuery = useMemo(() => (db && user ? query(collection(db, 'assessments'), where('status', '==', 'published'), limit(3)) : null), [db, user]);
  const { data: upcomingAssessments } = useCollection(assessmentsQuery)

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    if (hour >= 12 && hour < 17) setGreeting("Good afternoon")
    else if (hour >= 17) setGreeting("Good evening")
  }, [])

  if (!mounted) return null

  const userName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || "Alex"
  const userProfile = profile || {}

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] -mt-6 pb-24 font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 mt-2">
        <Avatar className="h-10 w-10 border border-gray-200">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.uid || 'alex'}`} />
          <AvatarFallback>{userName[0]}</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold text-[#b04a11]" style={{ fontFamily: 'Georgia, serif' }}>
          Nexlectra
        </h1>
        <button className="text-gray-800 hover:opacity-70 transition-opacity">
          <Bell className="h-6 w-6" />
        </button>
      </div>

      <div className="px-5 space-y-6 mt-4">
        {/* Header */}
        <div>
          <h2 className="text-[28px] font-bold text-gray-900 mb-1 leading-tight">
            {greeting}, {userName}
          </h2>
          <p className="text-gray-500 text-base font-medium">Ready to conquer your goals today?</p>
        </div>

        {/* Learning Streak */}
        <div className="bg-white rounded-[2rem] p-4 flex items-center gap-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
           <div className="h-12 w-12 rounded-full bg-[#ffebdb] flex flex-shrink-0 items-center justify-center">
             <Flame className="h-6 w-6 text-[#ff6b2b]" />
           </div>
           <div className="flex-1">
             <div className="flex justify-between items-center mb-2">
               <span className="font-semibold text-gray-900 text-sm">Learning Streak</span>
               <span className="font-bold text-[#ff6b2b] text-sm">{userProfile.learningStreak || 14} Days</span>
             </div>
             <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-[#ff6b2b] rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((userProfile.learningStreak || 14)/30)*100)}%` }} />
             </div>
           </div>
        </div>

        {/* AI Insight */}
        <div className="bg-white rounded-3xl p-6 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
           <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ff6b2b]"></div>
           <div className="flex justify-between items-center mb-3">
             <div className="flex items-center gap-1.5 text-[#ff6b2b] font-bold text-sm">
               <Sparkles className="h-4 w-4" />
               AI Insight
             </div>
             <div className="bg-gray-100 text-gray-600 text-[10px] uppercase font-bold px-3 py-1 rounded-full">
               Priority
             </div>
           </div>
           <h3 className="text-xl font-bold text-gray-900 mb-2">Review needed: React Hooks</h3>
           <p className="text-gray-500 text-sm font-medium leading-relaxed mb-5 pr-2">
             Your recent quiz scores indicate an opportunity to strengthen your understanding of useEffect.
           </p>
           <Button className="w-full bg-[#ff6b2b] hover:bg-[#e65c20] text-white rounded-xl py-6 font-bold shadow-md shadow-[#ff6b2b]/20" asChild>
             <Link href="/revision">Start Review Session</Link>
           </Button>
        </div>

        {/* Updates (Mapped to Assessments) */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Updates</h3>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2 snap-x">
             {upcomingAssessments?.length ? upcomingAssessments.map((assessment: any) => (
               <div key={assessment.id} className="min-w-[280px] bg-white rounded-3xl p-5 shadow-sm border border-gray-100 snap-center">
                 <div className="flex items-center gap-3 mb-3">
                   <div className="h-10 w-10 rounded-full bg-[#ffebdb] flex items-center justify-center text-[#ff6b2b] shrink-0">
                     <Megaphone className="h-4 w-4" />
                   </div>
                   <div>
                     <p className="text-xs text-gray-500 font-medium leading-tight">{assessment.type || 'Assignment'}</p>
                     <p className="font-bold text-gray-900 text-sm leading-tight">{assessment.subject || 'Coursework'}</p>
                   </div>
                 </div>
                 <p className="text-gray-700 text-base font-medium">{assessment.title || 'New study material has been posted.'}</p>
               </div>
             )) : (
               <div className="min-w-[280px] bg-white rounded-3xl p-5 shadow-sm border border-gray-100 snap-center text-gray-500 text-center">
                 No recent updates.
               </div>
             )}
          </div>
        </div>

        {/* Your Subjects (Mapped to Lectures) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="text-xl font-bold text-gray-900">Your Subjects</h3>
             <Link href="/study" className="text-[#ff6b2b] text-sm font-bold cursor-pointer hover:underline">See All</Link>
          </div>

          <div className="space-y-3">
             {lecturesLoading ? (
               <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-[#ff6b2b]" /></div>
             ) : lectures?.length ? lectures.map((lec: any, i: number) => {
               // Generate deterministic progress based on ID for visuals
               const progressVal = 40 + ((i * 15) % 50); 
               const dashOffset = 150.8 - (150.8 * (progressVal / 100));

               return (
                 <Link href={`/study/${lec.id}`} key={lec.id}>
                   <div className="bg-white rounded-[2rem] p-5 flex items-center justify-between border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-1 pr-4">
                         <h4 className="text-lg font-bold text-gray-900 mb-0.5 truncate">{lec.subject || 'Subject'}</h4>
                         <p className="text-gray-500 text-xs font-medium truncate">{lec.title}</p>
                      </div>
                      <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
                        <svg className="w-14 h-14 transform -rotate-90">
                          <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
                          <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-[#ff6b2b]" strokeDasharray="150.8" strokeDashoffset={dashOffset} strokeLinecap="round" />
                        </svg>
                        <span className="absolute font-bold text-[11px] text-gray-900">{progressVal}%</span>
                      </div>
                   </div>
                 </Link>
               )
             }) : (
               <div className="text-center p-6 text-gray-500 bg-white rounded-3xl border border-gray-100">
                 No subjects found.
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  )
}
