"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Calendar, BookOpen } from "lucide-react"

export default function AssignmentBuilder() {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("Intermediate")
  const [completionDate, setCompletionDate] = useState("")
  const [context, setContext] = useState("")

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans pb-24 px-6 mt-4">
      <div className="space-y-1 mb-8">
        <h1 className="text-[32px] font-bold text-gray-900 leading-tight">Build Assignment</h1>
        <p className="text-gray-600 font-medium text-[15px]">Let AI craft the perfect curriculum component.</p>
      </div>

      <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 space-y-6">
        
        {/* Topic */}
        <div className="space-y-2">
          <label className="text-gray-900 font-bold text-[13px] tracking-wide uppercase">Topic</label>
          <div className="flex items-center bg-[#fafafa] border border-gray-200 rounded-[1.25rem] px-4 h-14 focus-within:border-[#ff6b2b] transition-colors">
            <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="e.g., Photosynthesis in C4 plants" 
              className="bg-transparent border-none outline-none text-gray-600 text-[15px] placeholder:text-gray-400 flex-1"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="space-y-2">
          <label className="text-gray-900 font-bold text-[13px] tracking-wide uppercase">Difficulty Level</label>
          <div className="flex bg-[#fafafa] border border-gray-200 rounded-[1.25rem] p-1.5 h-14">
            {["Beginner", "Intermediate", "Advanced"].map(level => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`flex-1 text-[14px] font-bold rounded-[1rem] transition-all ${difficulty === level ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Target Completion Date */}
        <div className="space-y-2">
          <label className="text-gray-900 font-bold text-[13px] tracking-wide uppercase">Target Completion Date</label>
          <div className="flex items-center bg-[#fafafa] border border-gray-200 rounded-[1.25rem] px-4 h-14 focus-within:border-[#ff6b2b] transition-colors relative">
            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
            <input 
              type="date" 
              className="bg-transparent border-none outline-none text-gray-600 text-[15px] flex-1 appearance-none w-full"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
            />
          </div>
        </div>

        {/* Additional Context */}
        <div className="space-y-2">
          <label className="text-gray-900 font-bold text-[13px] tracking-wide uppercase">
            Additional Context <span className="text-gray-400 font-normal lowercase tracking-normal">(optional)</span>
          </label>
          <textarea 
            className="w-full h-32 bg-[#fafafa] border border-gray-200 rounded-[1.25rem] p-4 text-[15px] text-gray-600 placeholder:text-gray-400 focus:border-[#ff6b2b] focus:outline-none transition-colors resize-none"
            placeholder="Add specific requirements, standards, or focus areas..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button 
            className="w-full h-14 rounded-[1.25rem] bg-[#ff6b2b] hover:bg-[#e65c20] text-white text-lg font-bold shadow-md shadow-[#ff6b2b]/20 flex items-center justify-center gap-2"
          >
            <Sparkles className="h-5 w-5" />
            Magic Generate
          </Button>
        </div>
      </div>
    </div>
  )
}
