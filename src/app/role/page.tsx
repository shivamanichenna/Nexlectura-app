"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, HelpCircle, ChevronRight } from "lucide-react"

export default function RoleSelectionPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] p-6 max-w-md mx-auto relative">
      {/* Top App Bar */}
      <div className="flex items-center justify-between py-4">
        <button onClick={() => router.back()} className="text-gray-800 hover:opacity-70 transition-opacity">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <span className="font-extrabold text-xl text-[#ff6b2b]">Nexlectra</span>
        <button className="text-gray-800 hover:opacity-70 transition-opacity">
          <HelpCircle className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col mt-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Choose Your Path
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed px-4">
            Select your role to personalize your AI-driven experience.
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => router.push('/login?role=student')}
            className="w-full bg-white rounded-[2rem] p-4 flex items-center gap-4 hover:shadow-md transition-shadow group border border-gray-100"
          >
            <div className="h-24 w-24 bg-[#eae2d6] rounded-2xl flex-shrink-0 flex items-center justify-center relative overflow-hidden">
               {/* Simplified 3D placeholder */}
               <div className="absolute w-12 h-16 bg-[#d1c5b4] rounded-lg shadow-sm" />
               <div className="absolute bottom-2 w-full h-8 bg-black/5 blur-sm" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-1">I am a Student</h3>
              <p className="text-sm text-gray-500 leading-snug">Learn at your own pace with AI coaching.</p>
            </div>
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-[#ff6b2b] group-hover:text-white transition-colors">
              <ChevronRight className="h-5 w-5" />
            </div>
          </button>

          <button 
            onClick={() => router.push('/login?role=lecturer')}
            className="w-full bg-white rounded-[2rem] p-4 flex items-center gap-4 hover:shadow-md transition-shadow group border border-gray-100"
          >
            <div className="h-24 w-24 bg-[#eae2d6] rounded-2xl flex-shrink-0 flex items-center justify-center relative overflow-hidden">
               {/* Simplified 3D placeholder */}
               <div className="absolute w-12 h-16 bg-[#d1c5b4] rounded-lg shadow-sm flex flex-col gap-1 p-2">
                 <div className="w-full h-1 bg-white/50 rounded-full" />
                 <div className="w-3/4 h-1 bg-white/50 rounded-full" />
               </div>
               <div className="absolute bottom-2 w-full h-8 bg-black/5 blur-sm" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-1">I am a Lecturer</h3>
              <p className="text-sm text-gray-500 leading-snug">Optimize your classroom with AI analytics.</p>
            </div>
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-[#ff6b2b] group-hover:text-white transition-colors">
              <ChevronRight className="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>

      <div className="w-full pb-8 mt-12">
        <Button 
          disabled
          size="lg" 
          className="w-full h-14 rounded-2xl text-lg font-bold bg-[#f3f3f3] text-gray-400"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
