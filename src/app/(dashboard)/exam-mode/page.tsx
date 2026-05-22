"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Clock, Bookmark } from "lucide-react"

export default function ExamModePage() {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const options = [
    "Recurrence",
    "Self-Attention",
    "Convolution",
    "Pooling"
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans absolute inset-0 z-50">
      {/* Top Bar */}
      <div className="px-6 py-5 flex items-center justify-between bg-white">
        <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900 transition-colors">
          <X className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2 text-[#b04a11] font-bold text-lg">
          <Clock className="h-5 w-5" />
          14:20
        </div>
        <div className="w-6" /> {/* Placeholder to balance flex */}
      </div>

      {/* Progress */}
      <div className="px-6 py-2 bg-white border-b border-gray-100 pb-4">
        <div className="flex justify-between items-center mb-3 text-xs font-bold text-gray-600">
          <span>Question 5 of 15</span>
          <span>33%</span>
        </div>
        <div className="flex gap-1.5">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className={`h-2 flex-1 rounded-full ${i < 5 ? 'bg-[#b04a11]' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1">
          <div className="bg-[#fff3eb] text-[#b04a11] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full inline-block mb-6">
            NATURAL LANGUAGE PROCESSING
          </div>
          
          <h2 className="text-[22px] font-medium text-gray-900 leading-snug mb-8">
            Which of the following is a key characteristic of Transformers in NLP?
          </h2>

          <div className="space-y-4">
            {options.map((option, i) => (
              <button 
                key={i}
                onClick={() => setSelectedOption(i)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${selectedOption === i ? 'border-[#b04a11] bg-[#fff8f3]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedOption === i ? 'border-[#b04a11]' : 'border-gray-300'}`}>
                  {selectedOption === i && <div className="h-3 w-3 rounded-full bg-[#b04a11]" />}
                </div>
                <span className={`text-lg ${selectedOption === i ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-5 bg-white border-t border-gray-100 flex gap-4">
        <button className="h-[60px] w-[60px] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors shrink-0">
          <Bookmark className="h-6 w-6" />
        </button>
        <button 
          className={`flex-1 h-[60px] rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${selectedOption !== null ? 'bg-[#ffb38a] hover:bg-[#ffa06b] text-white' : 'bg-[#ffb38a]/70 text-white cursor-not-allowed'}`}
          disabled={selectedOption === null}
        >
          Submit Answer
          <span className="text-xl leading-none">&rarr;</span>
        </button>
      </div>
    </div>
  )
}
