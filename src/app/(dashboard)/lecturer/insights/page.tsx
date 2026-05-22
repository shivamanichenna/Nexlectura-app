"use client"

import { Sparkles, MoreHorizontal } from "lucide-react"

export default function ClassroomAnalytics() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans pb-24 px-6 mt-4">
      <div className="space-y-1 mb-8">
        <h1 className="text-[32px] font-bold text-gray-900 leading-tight">Classroom Analytics</h1>
        <p className="text-gray-600 font-medium text-[15px]">CS101: Intro to Computer Science</p>
      </div>

      {/* Class Proficiency Chart */}
      <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 space-y-6 mb-8">
        <div className="flex justify-between items-center">
          <h3 className="text-[14px] font-bold text-[#b04a11] uppercase tracking-wider">Class Proficiency</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        
        <div className="relative w-full aspect-square flex items-center justify-center">
          <svg viewBox="0 0 340 340" className="w-full h-full max-w-[280px]">
            {/* Background Grid */}
            <polygon points="170,40 293,130 246,270 94,270 47,130" fill="none" stroke="#e5e7eb" strokeWidth="2" />
            <polygon points="170,72 263,140 227,245 113,245 77,140" fill="none" stroke="#e5e7eb" strokeWidth="2" />
            <polygon points="170,105 232,150 208,220 132,220 108,150" fill="none" stroke="#e5e7eb" strokeWidth="2" />
            <polygon points="170,137 201,160 189,195 151,195 139,160" fill="none" stroke="#e5e7eb" strokeWidth="2" />
            
            {/* Axes */}
            <line x1="170" y1="170" x2="170" y2="40" stroke="#e5e7eb" strokeWidth="2" />
            <line x1="170" y1="170" x2="293" y2="130" stroke="#e5e7eb" strokeWidth="2" />
            <line x1="170" y1="170" x2="246" y2="270" stroke="#e5e7eb" strokeWidth="2" />
            <line x1="170" y1="170" x2="94" y2="270" stroke="#e5e7eb" strokeWidth="2" />
            <line x1="170" y1="170" x2="47" y2="130" stroke="#e5e7eb" strokeWidth="2" />
            
            {/* Data Polygon */}
            <polygon 
              points="170,60 260,110 200,250 120,240 60,105" 
              fill="#c8c2be" 
              opacity="0.6"
              stroke="#b04a11" 
              strokeWidth="0" 
            />
            
            {/* Data Points */}
            <circle cx="170" cy="60" r="6" fill="#ff6b2b" />
            <circle cx="260" cy="110" r="6" fill="#ff6b2b" />
            <circle cx="200" cy="250" r="6" fill="#ff6b2b" />
            <circle cx="120" cy="240" r="6" fill="#ff6b2b" />
            <circle cx="60" cy="105" r="6" fill="#ff6b2b" />

            {/* Labels */}
            <text x="170" y="25" textAnchor="middle" fill="#6b7280" fontSize="12" fontWeight="500">Logic</text>
            <text x="310" y="135" textAnchor="middle" fill="#6b7280" fontSize="12" fontWeight="500">Speed</text>
            <text x="255" y="295" textAnchor="middle" fill="#6b7280" fontSize="12" fontWeight="500">Accuracy</text>
            <text x="85" y="295" textAnchor="middle" fill="#6b7280" fontSize="12" fontWeight="500">Creativity</text>
            <text x="25" y="135" textAnchor="middle" fill="#6b7280" fontSize="12" fontWeight="500">Memory</text>
          </svg>
        </div>
      </div>

      {/* AI Struggle Detection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2 px-1">
          <Sparkles className="h-6 w-6 text-[#ff6b2b]" />
          <h2 className="text-[19px] font-bold text-gray-900">AI Struggle Detection</h2>
        </div>

        {/* Struggle Card 1 */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-[17px] font-bold text-gray-900">Recursive Functions</h3>
            <span className="bg-[#ffebdb] text-[#b04a11] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">High Priority</span>
          </div>
          <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
            42% of class failing test cases involving stack overflow limits. Suggest reviewing base cases.
          </p>
        </div>

        {/* Struggle Card 2 */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-[17px] font-bold text-gray-900">Graph Theory</h3>
            <span className="bg-[#f0f0f0] text-gray-600 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">Moderate</span>
          </div>
          <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
            Struggles with Dijkstra's algorithm implementation speed. Consider a visual trace exercise.
          </p>
        </div>
      </div>
    </div>
  )
}
