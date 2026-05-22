"use client"

import { useState } from "react"
import { Search, Monitor, Briefcase, Palette, Key, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ClassStudentManagement() {
  const [filter, setFilter] = useState("")

  const classes = [
    { id: 1, name: "CSE-A", subject: "Advanced Algorithms", icon: Monitor, iconColor: "text-[#b04a11]", iconBg: "bg-[#ffebdb]", code: "NX-8829", students: 42 },
    { id: 2, name: "MBA-I", subject: "Strategic Management", icon: Briefcase, iconColor: "text-gray-600", iconBg: "bg-[#e8ecf4]", code: "NX-1104", students: 28 },
    { id: 3, name: "Design 101", subject: "Intro to UX", icon: Palette, iconColor: "text-gray-600", iconBg: "bg-[#e8f0fe]", code: "NX-4492", students: 35 },
  ]

  const students = [
    { name: "Alex Chen", score: 92, avatar: "https://i.pravatar.cc/150?u=alex_chen", strokeColor: "stroke-[#ff6b2b]" },
    { name: "Sarah Jenkins", score: 85, avatar: "https://i.pravatar.cc/150?u=sarah_jenkins", strokeColor: "stroke-[#8b4513]" },
    { name: "Marcus Cole", score: 65, avatar: "https://i.pravatar.cc/150?u=marcus_cole", strokeColor: "stroke-[#778da9]" },
    { name: "Elena Rossi", score: 98, avatar: "https://i.pravatar.cc/150?u=elena_rossi", strokeColor: "stroke-[#ff6b2b]" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans pb-24 px-6 pt-6 relative">
      
      {/* Top App Bar */}
      <div className="flex items-center justify-between mb-8">
        <Avatar className="h-10 w-10 border shadow-sm">
          <AvatarImage src="https://i.pravatar.cc/150?u=dr_sarah" alt="Profile" />
          <AvatarFallback>DR</AvatarFallback>
        </Avatar>
        <span className="font-bold text-lg text-[#b04a11]">Professor Portal</span>
        <button className="text-gray-900 hover:opacity-70 transition-opacity">
          <Search className="h-6 w-6" />
        </button>
      </div>

      {/* Filter Input */}
      <div className="flex items-center bg-white border border-gray-200 rounded-[1.25rem] px-4 h-14 mb-8 shadow-sm">
        <Search className="h-5 w-5 text-gray-400 mr-3" />
        <input 
          type="text" 
          placeholder="Filter classes and students..." 
          className="bg-transparent border-none outline-none text-gray-600 text-[15px] placeholder:text-gray-400 flex-1"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Active Classes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[19px] font-bold text-gray-900">Active Classes</h2>
          <button className="text-[#ff6b2b] text-[13px] font-bold tracking-wide">View All</button>
        </div>
        
        <div className="space-y-4">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-between hover:border-[#ff6b2b]/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${cls.iconBg}`}>
                  <cls.icon className={`h-6 w-6 ${cls.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-bold text-[17px] text-gray-900">{cls.name}</h3>
                  <p className="text-[14px] text-gray-500">{cls.subject}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="bg-[#ff6b2b] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Key className="h-3 w-3" /> {cls.code}
                </div>
                <span className="text-[12px] text-gray-500 font-medium">{cls.students} Students</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Students Engagement */}
      <div>
        <h2 className="text-[19px] font-bold text-gray-900 mb-4">Top Students Engagement</h2>
        <div className="grid grid-cols-2 gap-4">
          {students.map((student, idx) => {
            const radius = 30
            const circumference = 2 * Math.PI * radius
            const strokeDashoffset = circumference - (student.score / 100) * circumference

            return (
              <div key={idx} className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="relative w-[76px] h-[76px] mb-3">
                   {/* Avatar */}
                   <Avatar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white shadow-sm z-10">
                     <AvatarImage src={student.avatar} alt={student.name} className="object-cover" />
                     <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                   </Avatar>
                   {/* Circular Progress Ring */}
                   <svg className="w-full h-full -rotate-90 relative z-0">
                     <circle cx="38" cy="38" r="30" fill="transparent" stroke="#f3f4f6" strokeWidth="6" />
                     <circle cx="38" cy="38" r="30" fill="transparent" className={student.strokeColor} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                   </svg>
                </div>
                <p className="text-[20px] font-bold text-gray-900 mb-0.5">{student.score}%</p>
                <p className="text-[13px] text-gray-500 font-medium">{student.name}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 w-16 h-16 bg-[#ff6b2b] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#ff6b2b]/30 hover:bg-[#e65c20] transition-colors z-50">
        <Plus className="h-8 w-8" />
      </button>

    </div>
  )
}
