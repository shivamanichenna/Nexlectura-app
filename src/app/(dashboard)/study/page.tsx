'use client';

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Search, Bell, SlidersHorizontal, Star, Clock, Loader2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useFirestore, useCollection } from '@/firebase'
import { collection, query, where, orderBy } from 'firebase/firestore'
import { useRouter } from "next/navigation"

export default function StudyHubPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("All Courses")
  const db = useFirestore()
  const router = useRouter()

  const tabs = ["All Courses", "Computer Science", "Design", "Business"]

  const lecturesQuery = useMemo(() => {
    if (!db) return null
    return query(
      collection(db, 'lectures'), 
      where('status', '==', 'completed')
      // Note: Needs a composite index if we orderBy as well, keeping it simple for now
    )
  }, [db])

  const { data: lectures, loading } = useCollection(lecturesQuery)

  const filteredLectures = (lectures || []).filter(lecture => {
    if (!lecture.title) return false
    return lecture.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] -mt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 bg-[#fafafa] sticky top-0 z-10">
        <Avatar className="h-10 w-10 shadow-sm border border-gray-100">
          <AvatarImage src="https://i.pravatar.cc/150?img=47" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span className="font-bold text-xl text-[#b84e14]">Nexlectra</span>
        <button className="text-gray-800 hover:opacity-70 transition-opacity">
          <Bell className="h-6 w-6" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 mt-2 mb-6 relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input 
            placeholder="Search lectures or subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 pl-12 pr-14 rounded-full bg-white border border-gray-200 focus-visible:ring-[#ff6b2b]/20 text-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)]" 
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors border border-gray-100">
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-6 overflow-x-auto hide-scrollbar flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab 
                ? "bg-[#1a1e29] text-white shadow-md" 
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Lectures List */}
      <div className="px-4 space-y-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff6b2b]" />
          </div>
        ) : filteredLectures.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
            No processed lectures found.
          </div>
        ) : (
          filteredLectures.map((lecture: any) => (
            <Card key={lecture.id} className="rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
              <div className="relative h-48 w-full bg-gradient-to-br from-[#1a1e29] to-[#2d3748] flex items-center justify-center">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                 <div className="text-center px-4 relative z-10">
                   <h3 className="font-bold text-white text-xl line-clamp-2 leading-tight drop-shadow-md">
                     {lecture.title}
                   </h3>
                   <p className="text-[#ff6b2b] text-sm font-bold mt-2 uppercase tracking-widest">{lecture.subject}</p>
                 </div>
                 
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg shadow-md border border-white/10">
                  <span className="font-bold text-sm text-white">AI Ready</span>
                </div>
                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white flex items-center gap-1.5 shadow-lg border border-white/10">
                  <Star className="h-3.5 w-3.5 fill-[#ff6b2b] text-[#ff6b2b]" />
                  <span className="font-semibold text-xs tracking-wide">4.9 (New)</span>
                </div>
              </div>
              <CardContent className="p-5">
                <p className="text-[#64748b] text-[10px] font-bold tracking-widest uppercase mb-2">
                  By {lecture.lecturerName || "Lecturer"}
                </p>
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-1">
                  {lecture.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {lecture.examSummary || "AI Summary generated from lecture transcript."}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium text-sm">~45 mins</span>
                  </div>
                  <Button 
                    onClick={() => router.push(`/study/${lecture.id}`)}
                    className="bg-[#ffebdb] hover:bg-[#ffdfc4] text-[#b84e14] rounded-xl px-6 font-bold h-10 shadow-none transition-colors"
                  >
                    Start Studying
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
