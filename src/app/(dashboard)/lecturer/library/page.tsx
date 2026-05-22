'use client';

import { FileText, PlaySquare, Clapperboard, Sparkles, Search, Filter, MoreVertical, Menu } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function LecturerLibraryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] -mt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 bg-[#fafafa] sticky top-0 z-10">
        <button className="text-gray-800 hover:opacity-70 transition-opacity">
          <Menu className="h-6 w-6" />
        </button>
        <span className="font-bold text-xl text-[#ff6b2b]">Nexlectra</span>
        <Avatar className="h-9 w-9 shadow-sm border border-gray-100">
          <AvatarImage src="https://i.pravatar.cc/150?img=11" />
          <AvatarFallback>L</AvatarFallback>
        </Avatar>
      </div>

      <div className="px-4 space-y-6 mt-2">
        {/* Dropzone */}
        <div className="border-[2.5px] border-dashed border-[#e2d5c8] rounded-[2rem] bg-white flex flex-col items-center justify-center py-10 px-4 text-center cursor-pointer hover:bg-orange-50/30 transition-colors shadow-sm">
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
          {/* File 1 */}
          <div className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm border border-gray-50">
            <div className="h-12 w-12 rounded-xl bg-[#fce8e6] flex items-center justify-center shrink-0">
              <PlaySquare className="h-6 w-6 text-[#d93025]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-[15px] truncate">Intro_to_NLP.pptx</h4>
              <p className="text-xs text-gray-500 mt-0.5">12MB • 2 days ago</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-2">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          {/* File 2 */}
          <div className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm border border-gray-50">
            <div className="h-12 w-12 rounded-xl bg-[#fcece3] flex items-center justify-center shrink-0">
              <FileText className="h-6 w-6 text-[#c25e22]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-[15px] truncate">Transformers_Research.pdf</h4>
              <p className="text-xs text-gray-500 mt-0.5">4.5MB • 1 week ago</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-2">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          {/* File 3 */}
          <div className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm border border-gray-50">
            <div className="h-12 w-12 rounded-xl bg-[#8c9bab] flex items-center justify-center shrink-0">
              <Clapperboard className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-[15px] truncate">Seminar_Recording.mp4</h4>
              <p className="text-xs text-gray-500 mt-0.5">240MB • 2 weeks ago</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-2">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          
          {/* Skeleton loading item */}
          <div className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm border border-gray-50 opacity-60">
            <div className="h-12 w-12 rounded-xl bg-gray-200 animate-pulse shrink-0"></div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
