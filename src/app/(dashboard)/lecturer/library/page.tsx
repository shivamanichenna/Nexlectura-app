'use client';

import { FileText, PlaySquare, Clapperboard, Sparkles, Search, Filter, MoreVertical, Menu, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useFirestore, useUser, useCollection } from '@/firebase'
import { collection, query, where, orderBy } from 'firebase/firestore'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

export default function LecturerLibraryPage() {
  const { user } = useUser()
  const db = useFirestore()
  const router = useRouter()

  const lecturesQuery = useMemo(() => {
    if (!db || !user) return null
    return query(
      collection(db, 'lectures'),
      where('lecturerId', '==', user.uid)
      // Note: omit orderBy('createdAt', 'desc') to avoid needing a composite index for now
    )
  }, [db, user])

  const { data: lectures, loading } = useCollection(lecturesQuery)

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] -mt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 bg-[#fafafa] sticky top-0 z-10">
        <button className="text-gray-800 hover:opacity-70 transition-opacity">
          <Menu className="h-6 w-6" />
        </button>
        <span className="font-bold text-xl text-[#ff6b2b]">Nexlectra</span>
        <Avatar className="h-9 w-9 shadow-sm border border-gray-100">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.uid || '11'}`} />
          <AvatarFallback>L</AvatarFallback>
        </Avatar>
      </div>

      <div className="px-4 space-y-6 mt-2">
        {/* Dropzone */}
        <div 
          onClick={() => router.push('/lecturer/upload')}
          className="border-[2.5px] border-dashed border-[#e2d5c8] rounded-[2rem] bg-white flex flex-col items-center justify-center py-10 px-4 text-center cursor-pointer hover:bg-orange-50/30 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4 text-[#5c697a]">
            <FileText className="h-8 w-8 stroke-[1.5px]" />
            <PlaySquare className="h-8 w-8 stroke-[1.5px]" />
            <Clapperboard className="h-8 w-8 stroke-[1.5px]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Course Material</h2>
          <p className="text-gray-500 text-sm mb-4">Drag and Drop / Tap to Upload</p>
          <div className="bg-gray-100/80 px-4 py-1.5 rounded-full text-xs font-medium text-gray-500">
            Supported formats: PDF, PPT, MP4
          </div>
        </div>

        {/* Processing State */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-4 relative overflow-hidden">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#e6e9f0] flex items-center justify-center shrink-0">
              <FileText className="h-6 w-6 text-[#c23b22]" />
            </div>
            <div className="flex-1 pt-0.5">
              <h4 className="font-semibold text-gray-900 text-sm">Lecture_05_Deep_Learning.pdf</h4>
              <div className="flex items-center gap-1.5 mt-1">
                <Sparkles className="h-3.5 w-3.5 text-[#ff6b2b]" />
                <span className="text-xs text-gray-500">Processing into Source of Truth...</span>
              </div>
            </div>
            <div className="font-bold text-[#ff6b2b] text-sm pt-0.5">
              65%
            </div>
          </div>
          <div className="mt-4 flex h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="bg-[#ff6b2b] w-[65%] rounded-full"></div>
          </div>
        </div>

        {/* Your Library Header */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-2xl font-bold text-gray-900">Your Library</h2>
          <div className="flex gap-2">
            <button className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50">
              <Search className="h-4 w-4" />
            </button>
            <button className="h-10 px-4 rounded-full bg-white border border-gray-200 flex items-center gap-2 text-gray-700 text-sm font-medium shadow-sm hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Files List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-[#ff6b2b]" />
            </div>
          ) : lectures && lectures.length > 0 ? (
            lectures.map((lecture: any) => (
              <div key={lecture.id} className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm border border-gray-50">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${lecture.status === 'completed' ? 'bg-[#eefcf2] text-green-600' : 'bg-[#fce8e6] text-[#d93025]'}`}>
                  {lecture.status === 'completed' ? <Sparkles className="h-6 w-6" /> : <PlaySquare className="h-6 w-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-[15px] truncate">{lecture.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{lecture.subject} • {lecture.status}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-2">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 font-medium">
              No course materials uploaded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
